'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

enum BudgetItemStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

enum InvoiceStatus {
    PENDING = 'PENDING',
    PAID = 'PAID'
}

export async function generateInvoice(projectId: string) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return { success: false, message: 'Unauthorized' };
        }

        // Verify membership and admin role
        const member = await prisma.projectMember.findUnique({
            where: {
                userId_projectId: {
                    userId: session.user.id,
                    projectId: projectId
                }
            }
        });

        if (!member || member.role !== 'ADMIN') {
            return { success: false, message: 'Only Business Admins can generate invoices.' };
        }

        // Fetch all approved budget items
        const approvedItems = await prisma.budgetItem.findMany({
            where: {
                projectId: projectId,
                status: BudgetItemStatus.APPROVED
            }
        });

        if (approvedItems.length === 0) {
            return { success: false, message: 'No approved budget items found to invoice.' };
        }

        const totalAmount = approvedItems.reduce((sum: number, item: any) => sum + item.amount, 0);

        // Create the invoice
        const invoice = await prisma.invoice.create({
            data: {
                projectId: projectId,
                totalAmount: totalAmount,
                status: InvoiceStatus.PENDING
            },
            include: {
                project: {
                    select: { name: true }
                }
            }
        });

        // Revalidate the invoices page and project page
        revalidatePath('/dashboard/invoices');
        revalidatePath(`/dashboard/project/${projectId}`);

        return { success: true, invoice };
    } catch (error: any) {
        console.error('Error generating invoice:', error);
        return { success: false, message: error.message || 'Failed to generate invoice.' };
    }
}

export async function updateInvoiceStatus(invoiceId: string, status: InvoiceStatus) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return { success: false, message: 'Unauthorized' };
        }

        // Ensure user is an admin of the project this invoice belongs to
        const invoiceInfo = await prisma.invoice.findUnique({
            where: { id: invoiceId },
            select: { projectId: true }
        });

        if (!invoiceInfo) {
            return { success: false, message: 'Invoice not found.' };
        }

        const member = await prisma.projectMember.findUnique({
            where: {
                userId_projectId: {
                    userId: session.user.id,
                    projectId: invoiceInfo.projectId
                }
            }
        });

        if (!member || member.role !== 'ADMIN') {
            return { success: false, message: 'Only Admins can update invoice status.' };
        }

        const updatedInvoice = await prisma.invoice.update({
            where: { id: invoiceId },
            data: { status }
        });

        revalidatePath('/dashboard/invoices');

        return { success: true, invoice: updatedInvoice };
    } catch (error: any) {
        console.error('Error updating invoice status:', error);
        return { success: false, message: error.message || 'Failed to update invoice.' };
    }
}
