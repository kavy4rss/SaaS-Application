'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateProjectProgress(
    projectId: string,
    progress: number,
    sourceCode: string
) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            throw new Error('Unauthorized.');
        }

        const userId = session.user.id;

        // Verify membership. Any member can update progress currently. 
        // You could restrict to ADMIN only if desired.
        const member = await prisma.projectMember.findUnique({
            where: { userId_projectId: { userId, projectId } },
        });

        if (!member) {
            throw new Error('Forbidden: You are not a member of this project.');
        }

        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: {
                progress,
                // Optional feature: only update source code if provided, or allow clearing it
                description: sourceCode, // Using description as source_code field per user's earlier mock setup, or a dedicated column if added.
            },
        });

        revalidatePath(`/dashboard/project/${projectId}`);
        revalidatePath('/dashboard/overview');

        return { success: true, project: updatedProject };
    } catch (error: any) {
        console.error('Error updating project progress:', error);
        return { success: false, message: error.message || 'Failed to update project.' };
    }
}
