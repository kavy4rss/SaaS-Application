'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Folder, MessageSquare, FileText, LogOut, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { logoutAction } from '@/app/actions/auth-actions';

export default function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();

  const links = [
    { name: 'Overview', href: '/dashboard/overview', icon: Home },
    { name: 'Projects', href: '/dashboard/overview', icon: Folder },
    { name: 'Chat', href: '/dashboard/chat', icon: MessageSquare },
    { name: 'Invoices', href: '/dashboard/invoices', icon: FileText },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-tight text-primary">DecorFlow</h2>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid gap-2 px-4">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="border-t p-4 flex items-center justify-between bg-card">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="h-9 w-9 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
            {user?.image ? (
              <img src={user.image} alt="Avatar" className="h-9 w-9 rounded-full object-cover" />
            ) : (
              <UserIcon className="h-4 w-4 text-primary" />
            )}
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-medium leading-none truncate">
              {user?.name || user?.email || 'User'}
            </span>
            <span className="text-xs text-muted-foreground mt-1 capitalize truncate">
              {user?.role?.toLowerCase() || 'Member'}
            </span>
          </div>
        </div>

        <form action={logoutAction}>
          <Button variant="ghost" size="icon" type="submit" className="shrink-0 text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
