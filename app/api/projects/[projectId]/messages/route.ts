import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ projectId: string }> }
) {
    try {
        const { projectId } = await context.params;
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }


        // Ensure the user actually has access to this project
        const member = await prisma.projectMember.findUnique({
            where: {
                userId_projectId: {
                    userId: session.user.id,
                    projectId,
                }
            }
        });

        if (!member) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Fetch the last 50 messages, ordered ascending (oldest first for chat flow)
        const messages = await prisma.chatMessage.findMany({
            where: { projectId },
            take: 50,
            orderBy: { createdAt: 'desc' }, // Get newest 50
            include: {
                user: { select: { name: true, image: true } }
            }
        });

        // Reverse to display newest at the bottom
        const sortedMessages = messages.reverse().map((msg: any) => ({
            ...msg,
            senderInfo: { name: msg.user.name, image: msg.user.image }
        }));

        return NextResponse.json({ messages: sortedMessages });
    } catch (error: any) {
        console.error('Error fetching chat messages:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
