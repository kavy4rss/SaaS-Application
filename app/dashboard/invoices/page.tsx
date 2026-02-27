import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import InvoiceList from '@/components/invoices/InvoiceList';

export default async function InvoicesPage() {
    const session = await auth();
    if (!session || !session.user || !session.user.id) redirect('/login');

    const userId = session.user.id;

    // Fetch all invoices for projects where the user is a member
    const userProjects = await prisma.projectMember.findMany({
        where: { userId },
        select: { projectId: true },
    });

    const projectIds = userProjects.map((p: any) => p.projectId);

    const invoicesData = await prisma.invoice.findMany({
        where: {
            projectId: { in: projectIds }
        },
        include: {
            project: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
    });

    // Transform to match the UI component signature
    const formattedInvoices = invoicesData.map((inv: any) => ({
        id: inv.id,
        projectId: inv.projectId,
        projectName: inv.project.name,
        totalAmount: inv.totalAmount,
        status: inv.status,
        createdAt: inv.createdAt
    }));

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto p-4 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
                    <p className="text-muted-foreground mt-2">
                        View and download your billing history.
                    </p>
                </div>
            </div>

            <InvoiceList initialInvoices={formattedInvoices} />
        </div>
    );
}
