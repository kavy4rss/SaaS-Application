'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { joinProject } from '@/app/actions/project';

export default function JoinProjectForm() {
    const router = useRouter();
    const [inviteCode, setInviteCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteCode.trim()) return;

        setIsLoading(true);
        try {
            const res = await joinProject(inviteCode.toUpperCase());
            if (res.success && res.project) {
                toast.success(`Successfully joined ${res.project.name}!`);
                setInviteCode('');
                router.push(`/dashboard/project/${res.project.id}`);
            } else {
                toast.error(res.message || 'Invalid or expired invite code');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <KeyRound className="w-4 h-4" />
                </div>
                <Input
                    className="pl-9"
                    placeholder="Enter Invite Code (e.g. A1B2)"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    required
                />
            </div>
            <Button type="submit" disabled={isLoading || !inviteCode.trim()} variant="secondary">
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Join Project
            </Button>
        </form>
    );
}
