'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Briefcase, Paintbrush, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { updateUserRole } from '@/app/actions/user';
import { useSession } from 'next-auth/react';

export default function OnboardingPage() {
    const router = useRouter();
    const { update } = useSession();
    const [role, setRole] = useState<'BUSINESS' | 'FREELANCER' | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!role) {
            toast.error('Please select a role to continue.');
            return;
        }

        setIsLoading(true);
        try {
            const res = await updateUserRole(role);
            if (res.success) {
                // Force the NextAuth session to update via the JWT callback 
                await update({ role });
                toast.success("Welcome aboard!");
                router.push('/dashboard');
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Failed to save role");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md border-border">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-2xl text-foreground">Welcome to DecorFlow</CardTitle>
                    <CardDescription>
                        Tell us how you'll be using the platform
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-foreground mb-1">Select your role</label>

                            <div
                                className={`relative border rounded-lg p-4 cursor-pointer transition-all ${role === 'BUSINESS' ? 'border-primary ring-1 ring-primary bg-primary/5' : 'hover:border-foreground/30'
                                    }`}
                                onClick={() => setRole('BUSINESS')}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Business Owner</h3>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Create projects, manage budgets, and invite freelancers.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div
                                className={`relative border rounded-lg p-4 cursor-pointer transition-all ${role === 'FREELANCER' ? 'border-primary ring-1 ring-primary bg-primary/5' : 'hover:border-foreground/30'
                                    }`}
                                onClick={() => setRole('FREELANCER')}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                                        <Paintbrush className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Designer / Freelancer</h3>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Join projects, upload moodboards, and propose budgets.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-4"
                            size="lg"
                            disabled={isLoading || !role}
                        >
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Complete Setup
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
