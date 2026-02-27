'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { pusherServer } from '@/lib/pusher';

enum BudgetItemStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

/**
 * Allows any project member (Freelancer or Business) to propose a new budget item.
 */
export async function proposeBudgetItem(projectId: string, title: string, amount: number) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            throw new Error('Unauthorized.');
        }

        const userId = session.user.id;

        // Verify membership
        const member = await prisma.projectMember.findUnique({
            where: { userId_projectId: { userId, projectId } },
        });

        if (!member) {
            throw new Error('You are not a member of this project.');
        }

        const item = await prisma.budgetItem.create({
            data: {
                projectId,
                title,
                amount,
                status: BudgetItemStatus.PENDING, // Default status
            },
        });

        await pusherServer.trigger(`project-${projectId}`, 'budget-updated', item);

        revalidatePath(`/dashboard/project/${projectId}`);
        revalidatePath('/dashboard/budget');

        return { success: true, item };
    } catch (error: any) {
        console.error('Error proposing budget item:', error);
        return { success: false, message: error.message || 'Failed to propose item.' };
    }
}

/**
 * Allows ONLY users with the 'ADMIN' role in the project to approve or reject items.
 */
export async function updateBudgetItemStatus(
    projectId: string,
    itemId: string,
    newStatus: BudgetItemStatus
) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            throw new Error('Unauthorized.');
        }

        const userId = session.user.id;

        // Strict Security verification: Must be an ADMIN
        const member = await prisma.projectMember.findUnique({
            where: { userId_projectId: { userId, projectId } },
        });

        if (!member || member.role !== 'ADMIN') {
            throw new Error('Forbidden: Only Project Admins can update budget status.');
        }

        // Verify the item belongs to the project
        const existingItem = await prisma.budgetItem.findUnique({
            where: { id: itemId },
        });

        if (!existingItem || existingItem.projectId !== projectId) {
            throw new Error('Budget item not found in this project.');
        }

        const updatedItem = await prisma.budgetItem.update({
            where: { id: itemId },
            data: { status: newStatus },
        });

        await pusherServer.trigger(`project-${projectId}`, 'budget-updated', updatedItem);

        revalidatePath(`/dashboard/project/${projectId}`);
        revalidatePath('/dashboard/budget');

        return { success: true, item: updatedItem };
    } catch (error: any) {
        console.error('Error updating budget status:', error);
        return { success: false, message: error.message || 'Failed to update status.' };
    }
}
