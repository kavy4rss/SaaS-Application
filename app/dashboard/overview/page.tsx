import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Folder, DollarSign, Mail, ArrowRight, Users } from 'lucide-react';
import CreateProjectModal from '@/components/projects/CreateProjectModal';
import JoinProjectForm from '@/components/projects/JoinProjectForm';

export default async function OverviewPage() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) return null;

  const userId = session.user.id;
  const userRole = session.user.role;

  // Fetch Member Projects
  const projectMembers = await prisma.projectMember.findMany({
    where: { userId },
    include: {
      project: {
        include: {
          budgetItems: {
            where: { status: 'APPROVED' }
          },
          members: true,
        }
      }
    }
  });

  const projects = projectMembers.map((pm: any) => pm.project);

  // Stats Calculations
  const activeProjectsCount = projects.length;

  const totalApprovedBudget = projects.reduce((acc: number, project: any) => {
    return acc + project.budgetItems.reduce((sum: number, item: any) => sum + item.amount, 0);
  }, 0);

  // Since invites are link-based in this schema, we show 0 or mock a pending invite stat
  const pendingInvitesCount = 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Project Overview</h2>
          <p className="text-muted-foreground mt-2">
            Welcome back, {session.user.name || 'User'}! Here is your latest project snapshot.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {userRole === 'BUSINESS' ? (
            <CreateProjectModal />
          ) : (
            <JoinProjectForm />
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjectsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all teams</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget Approved</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalApprovedBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">In active projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invites</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvitesCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting your response</p>
          </CardContent>
        </Card>
      </div>

      {/* Project Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold tracking-tight">Your Projects</h3>
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-card text-center">
            <Folder className="h-10 w-10 text-muted-foreground mb-4" />
            <h4 className="text-lg font-semibold">No active projects</h4>
            <p className="text-sm text-muted-foreground max-w-sm mt-2 mb-6">
              You are not currently part of any projects. Create one or join using an invite code.
            </p>
            {userRole === 'BUSINESS' ? (
              <CreateProjectModal />
            ) : (
              <div className="max-w-xs mx-auto">
                <JoinProjectForm />
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project: any) => (
              <Card key={project.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {project.description || 'No description provided.'}
                  </p>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    <span>{project.members.length} Members</span>
                  </div>
                </CardContent>
                <div className="p-4 pt-0 mt-auto">
                  <Link href={`/dashboard/project/${project.id}`}>
                    <Button className="w-full flex items-center justify-center gap-2">
                      Open Workspace <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
