'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function updateUserRole(role: 'BUSINESS' | 'FREELANCER') {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return { success: false, message: 'Unauthorized' };
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: { role }
        });

        revalidatePath('/dashboard');
        return { success: true };
    } catch (error: any) {
        console.error('Error updating role:', error);
        return { success: false, message: error.message || 'Failed to update role' };
    }
}
