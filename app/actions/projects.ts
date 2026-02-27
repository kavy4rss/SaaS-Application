'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function joinProject(inviteCode: string) {
    try {
        // 1. Verify the user is logged in
        const session = await auth();

        if (!session || !session.user || !session.user.id) {
            throw new Error('You must be logged in to join a project.');
        }

        const userId = session.user.id;

        // 2. Find a project by the code
        const project = await prisma.project.findUnique({
            where: {
                inviteCode: inviteCode,
            },
        });

        if (!project) {
            throw new Error('Invalid or expired invite code.');
        }

        // Check if the user is already a member to prevent duplicates
        const existingMember = await prisma.projectMember.findUnique({
            where: {
                userId_projectId: {
                    userId,
                    projectId: project.id,
                },
            },
        });

        if (existingMember) {
            return {
                success: false,
                message: 'You are already a member of this project.',
            };
        }

        // 3. Create a record in ProjectMember for that user
        await prisma.projectMember.create({
            data: {
                userId,
                projectId: project.id,
                role: 'MEMBER', // Default role for joining via invite code
            },
        });

        // Revalidate the dashboard overview so their new project appears instantly
        revalidatePath('/dashboard/overview');

        return {
            success: true,
            message: `Successfully joined workspace: ${project.name}`,
        };
    } catch (error: any) {
        console.error('Error joining project:', error);
        return {
            success: false,
            message: error.message || 'An unexpected error occurred while joining the project.',
        };
    }
}
