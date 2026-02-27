'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { randomBytes } from 'crypto';

function generateInviteCode() {
    return randomBytes(4).toString('hex').toUpperCase();
}

export async function createProject(name: string, description: string) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return { success: false, message: 'Unauthorized' };
        }

        if (session.user.role !== 'BUSINESS') {
            return { success: false, message: 'Only Business users can create projects' };
        }

        const inviteCode = generateInviteCode();

        const project = await prisma.project.create({
            data: {
                name,
                description,
                inviteCode,
                members: {
                    create: {
                        userId: session.user.id,
                        role: 'ADMIN'
                    }
                }
            }
        });

        revalidatePath('/dashboard/overview');
        return { success: true, project };
    } catch (error: any) {
        console.error('Error creating project:', error);
        return { success: false, message: error.message || 'Failed to create project' };
    }
}

export async function joinProject(inviteCode: string) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return { success: false, message: 'Unauthorized' };
        }

        const project = await prisma.project.findUnique({
            where: { inviteCode }
        });

        if (!project) {
            return { success: false, message: 'Invalid invite code' };
        }

        const existingMember = await prisma.projectMember.findUnique({
            where: {
                userId_projectId: {
                    userId: session.user.id,
                    projectId: project.id
                }
            }
        });

        if (existingMember) {
            return { success: false, message: 'You are already a member of this project' };
        }

        await prisma.projectMember.create({
            data: {
                userId: session.user.id,
                projectId: project.id,
                role: 'MEMBER'
            }
        });

        revalidatePath('/dashboard/overview');
        return { success: true, project };
    } catch (error: any) {
        console.error('Error joining project:', error);
        return { success: false, message: error.message || 'Failed to join project' };
    }
}

export async function updateProjectProgress(projectId: string, progress: number) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return { success: false, message: 'Unauthorized' };
        }

        const validProgress = Math.max(0, Math.min(100, Math.round(progress)));

        // Verify that the user is an ADMIN of this project
        const member = await prisma.projectMember.findUnique({
            where: {
                userId_projectId: {
                    userId: session.user.id,
                    projectId: projectId
                }
            }
        });

        if (!member || member.role !== 'ADMIN') {
            return { success: false, message: 'Only project Admins can update progress.' };
        }

        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: { progress: validProgress }
        });

        // Trigger Pusher event to sync the progress bar
        const { pusherServer } = await import('@/lib/pusher');
        await pusherServer.trigger(`project-${projectId}`, 'progress-updated', updatedProject);

        revalidatePath(`/dashboard/project/${projectId}`);
        revalidatePath('/dashboard/overview');

        return { success: true, progress: validProgress };
    } catch (error: any) {
        console.error('Error updating project progress:', error);
        return { success: false, message: error.message || 'Failed to update progress.' };
    }
}
