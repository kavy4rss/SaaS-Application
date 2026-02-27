'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Sidebar from '@/components/layout/Sidebar';
import { useState } from 'react';

export default function MobileNavbar({ user }: { user: any }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="font-bold text-lg text-primary tracking-tight">DecorFlow</div>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72">
                    {/* We reuse the Sidebar component inside the Sheet. It will automatically handle closing when links are clicked if we want, but letting them just navigate is fine for a dashboard context. */}
                    <div className="h-full flex flex-col pt-4">
                        <Sidebar user={user} />
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}
