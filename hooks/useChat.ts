import { useState, useEffect } from 'react';
import { pusherClient } from '@/lib/pusher';
import { sendChatMessage } from '@/app/actions/chat';
import { toast } from 'sonner';

// Type representing the shape returned by the DB+Pusher trigger
export type MessageData = {
    id: string;
    projectId: string;
    userId: string;
    content: string;
    createdAt: string | Date;
    senderInfo?: {
        name: string | null;
        image: string | null;
    };
};

export const useChat = (projectId: string, currentUserId?: string) => {
    const [messages, setMessages] = useState<MessageData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initial Fetch effect (Assuming a simple GET endpoint, but we'll mock the fetch here since 
    // we are instructed to just "fetch to DB". We can provide a basic fetch signature or rely on a server component.
    // We'll mock the initial fetch here or create a dedicated API route if needed.)
    useEffect(() => {
        const fetchInitialMessages = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/projects/${projectId}/messages`);
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data.messages || []);
                } else {
                    // We degrade gracefully if the endpoint isn't wired yet.
                }
            } catch (err) {
                console.error("Failed fetching initial messages", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (projectId) fetchInitialMessages();
    }, [projectId]);

    // Pusher Subscription effect
    useEffect(() => {
        if (!projectId || !pusherClient) return;

        const channelName = `project-${projectId}`;
        const channel = pusherClient.subscribe(channelName);

        channel.bind('new-message', (data: MessageData) => {
            // Only append if it's NOT our own message. 
            // (Because we will optimistically append our own messages instantly).
            if (data.userId !== currentUserId) {
                setMessages((prev) => [...prev, data]);
            }
        });

        return () => {
            channel.unbind('new-message');
            pusherClient?.unsubscribe(channelName);
        };
    }, [projectId, currentUserId]);

    const sendMessage = async (content: string) => {
        if (!content.trim() || !currentUserId) return;

        // 1. Optimistic Update
        const tempMessage: MessageData = {
            id: `temp-${Date.now()}`,
            projectId,
            userId: currentUserId,
            content,
            createdAt: new Date(),
            senderInfo: { name: 'You', image: null }, // Simple fallback for UI
        };

        setMessages((prev) => [...prev, tempMessage]);

        // 2. Server Action to Persist & Broadcast
        const response = await sendChatMessage(projectId, content);

        if (!response.success) {
            toast.error(response.message || "Failed to send message");
            // Rollback optimistic update on failure
            setMessages((prev) => prev.filter(msg => msg.id !== tempMessage.id));
        } else {
            // Successfully sent; optionally replace temp id with real DB id
            setMessages((prev) =>
                prev.map(msg => msg.id === tempMessage.id ? (response.message as MessageData) : msg)
            );
        }
    };

    return { messages, isLoading, sendMessage };
};
