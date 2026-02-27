import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import MobileNavbar from '@/components/layout/MobileNavbar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r bg-card">
        <Sidebar user={session.user} />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden w-full">
        {/* Mobile Navbar */}
        <div className="md:hidden flex h-16 items-center justify-between border-b px-4 bg-card">
          <MobileNavbar user={session.user} />
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
