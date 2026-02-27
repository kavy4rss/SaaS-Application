'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { pusherServer } from '@/lib/pusher';

export async function sendChatMessage(projectId: string, content: string) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            throw new Error('Unauthorized.');
        }

        const userId = session.user.id;

        // 1. Verify user is a member of the project
        const member = await prisma.projectMember.findUnique({
            where: {
                userId_projectId: {
                    userId,
                    projectId,
                },
            },
            include: {
                user: { select: { name: true, image: true } } // needed for pusher payload
            }
        });

        if (!member) {
            throw new Error('You do not have permission to send messages in this project.');
        }

        // 2. Save the real message to the database
        const messageRecord = await prisma.chatMessage.create({
            data: {
                projectId,
                userId,
                content,
            },
            include: {
                user: { select: { name: true, image: true } } // include sender details
            }
        });

        // 3. Trigger Pusher Event to broadcast to all other listeners
        const channelName = `project-${projectId}`;
        const eventName = 'new-message';

        await pusherServer.trigger(channelName, eventName, {
            ...messageRecord,
            // Pass along the sender's info to immediately populate the UI for others
            senderInfo: {
                name: member.user.name || 'Unknown',
                image: member.user.image,
            }
        });

        return { success: true, message: messageRecord };

    } catch (error: any) {
        console.error('Error sending message:', error);
        return {
            success: false,
            message: error.message || 'An unexpected error occurred.',
        };
    }
}
