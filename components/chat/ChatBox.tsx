'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

export default function ChatBox({ projectId, currentUserId }: { projectId: string, currentUserId: string }) {
    const { messages, isLoading, sendMessage } = useChat(projectId, currentUserId);
    const [content, setContent] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        const messageToSend = content;
        setContent(''); // Clear instantly for UX
        await sendMessage(messageToSend);
    };

    return (
        <div className="flex flex-col h-full border rounded-lg bg-card/50">
            {/* Header */}
            <div className="p-4 border-b">
                <h3 className="font-semibold tracking-tight">Project Chat</h3>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-[300px]">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        Loading history...
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        // Check based on the ID. In a real app we might pass the full session user object down
                        const isMe = msg.userId === currentUserId;
                        return (
                            <div
                                key={msg.id || index}
                                className={`flex flex-col gap-1 max-w-[80%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                            >
                                <span className="text-xs text-muted-foreground px-1">
                                    {msg.senderInfo?.name || 'Unknown'}
                                </span>
                                <div
                                    className={`px-4 py-2 rounded-2xl text-sm ${isMe ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-background rounded-b-lg">
                <form onSubmit={handleSubmit} className="flex gap-2 relative">
                    <Input
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Type your message... (Press Enter to send)"
                        className="pr-12"
                        disabled={isLoading || !projectId}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="absolute right-1 top-1 h-8 w-8"
                        disabled={!content.trim() || isLoading}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
