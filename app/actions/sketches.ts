'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { pusherServer } from '@/lib/pusher';

export async function saveSketchToDatabase(projectId: string, title: string, imageUrl: string) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            throw new Error('You must be logged in to upload a sketch.');
        }

        const userId = session.user.id;

        // Verify user is a member of this project
        const member = await prisma.projectMember.findUnique({
            where: {
                userId_projectId: {
                    userId,
                    projectId,
                },
            },
        });

        if (!member) {
            throw new Error('You do not have permission to upload to this project.');
        }

        // Save sketch reference to database
        const sketch = await prisma.sketch.create({
            data: {
                projectId,
                imageUrl,
                title,
            },
        });

        // Trigger real-time update to all connected clients in the project room
        await pusherServer.trigger(`project-${projectId}`, 'new-sketch', sketch);

        // Revalidate paths where moodboards are shown
        revalidatePath(`/dashboard/project/${projectId}`);
        revalidatePath('/dashboard/moodboard');

        return { success: true, sketch };
    } catch (error: any) {
        console.error('Error saving sketch to database:', error);
        return {
            success: false,
            message: error.message || 'An unexpected error occurred.',
        };
    }
}
