import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import ChatBox from '@/components/chat/ChatBox';
import UploadSketchModal from '@/components/moodboard/UploadSketchModal';
import BudgetActions from '@/components/budget/BudgetActions';
import ProposeBudgetForm from '@/components/budget/ProposeBudgetForm';
import ProjectProgressSlider from '@/components/projects/ProjectProgressSlider';
import GenerateInvoiceButton from '@/components/invoices/GenerateInvoiceButton';

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) redirect('/login');

    const projectId = params.id;
    const userId = session.user.id;

    // Fetch Project and verify membership
    const member = await prisma.projectMember.findUnique({
        where: { userId_projectId: { userId, projectId } },
        include: {
            project: {
                include: {
                    sketches: { orderBy: { createdAt: 'desc' } },
                    budgetItems: { orderBy: { createdAt: 'desc' } }
                }
            }
        }
    });

    if (!member) {
        // Or render a "Not authorized" page
        redirect('/dashboard/overview');
    }

    const { project } = member;
    const isAdmin = member.role === 'ADMIN';

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto">

            {/* Project Header Info */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                    <p className="text-muted-foreground mt-2 max-w-xl">
                        {project.description || 'No project description provided.'}
                    </p>
                </div>

                <Card className="w-full md:w-72 bg-muted/30">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Project Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl font-bold">{project.progress}%</span>
                        </div>
                        <ProjectProgressSlider
                            projectId={projectId}
                            initialProgress={project.progress}
                            isAdmin={isAdmin}
                        />
                        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                            <span>Role: <strong className="text-foreground">{member.role}</strong></span>
                            <span>Join Code: <code className="bg-muted px-1 rounded">{project.inviteCode}</code></span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs Layout */}
            <Tabs defaultValue="moodboard" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-md bg-muted/50">
                    <TabsTrigger value="moodboard">Moodboard</TabsTrigger>
                    <TabsTrigger value="budget">Budget</TabsTrigger>
                    <TabsTrigger value="chat">Team Chat</TabsTrigger>
                </TabsList>

                {/* --- MOODBOARD TAB --- */}
                <TabsContent value="moodboard" className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Moodboard & Sketches</h2>
                        <UploadSketchModal projectId={projectId} />
                    </div>

                    {project.sketches.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg text-muted-foreground">
                            <p>No sketches uploaded yet. Start collaborating!</p>
                        </div>
                    ) : (
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                            {project.sketches.map((sketch: any) => (
                                <div key={sketch.id} className="break-inside-avoid relative group rounded-xl overflow-hidden border bg-card">
                                    <img
                                        src={sketch.imageUrl}
                                        alt={sketch.title || 'Sketch'}
                                        className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                        <p className="p-4 text-white font-medium truncate w-full">
                                            {sketch.title || 'Untitled Sketch'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* --- BUDGET TAB --- */}
                <TabsContent value="budget" className="space-y-4 pt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-semibold">Budget & Approvals</h2>
                            {isAdmin && <GenerateInvoiceButton projectId={projectId} />}
                        </div>
                        {!isAdmin && <ProposeBudgetForm projectId={projectId} />}
                    </div>

                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item Title</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {project.budgetItems.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={isAdmin ? 4 : 3} className="text-center text-muted-foreground py-8">
                                            No budget items proposed yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    project.budgetItems.map((item: any) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.title}</TableCell>
                                            <TableCell>${item.amount.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        item.status === 'APPROVED' ? 'default' :
                                                            item.status === 'REJECTED' ? 'destructive' : 'secondary'
                                                    }
                                                >
                                                    {item.status}
                                                </Badge>
                                            </TableCell>
                                            {isAdmin && (
                                                <TableCell className="text-right">
                                                    <BudgetActions
                                                        projectId={projectId}
                                                        itemId={item.id}
                                                        currentStatus={item.status}
                                                    />
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                {/* --- CHAT TAB --- */}
                <TabsContent value="chat" className="pt-4 h-[600px]">
                    <div className="h-full">
                        <ChatBox projectId={projectId} currentUserId={userId} />
                    </div>
                </TabsContent>

            </Tabs>
        </div>
    );
}
