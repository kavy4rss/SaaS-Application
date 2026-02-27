'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createProject } from '@/app/actions/project';

export default function CreateProjectModal() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsLoading(true);
        try {
            const res = await createProject(name, description);
            if (res.success && res.project) {
                toast.success(`Project created! Invite code: ${res.project.inviteCode}`);
                setIsOpen(false);
                setName('');
                setDescription('');
                router.push(`/dashboard/project/${res.project.id}`);
            } else {
                toast.error(res.message || 'Failed to create project');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" /> New Project
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                        A unique invite code will be generated for your freelancers to join.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">Project Name</label>
                        <Input
                            id="name"
                            placeholder="e.g. Modern Minimalist Living Room"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium">Description (Optional)</label>
                        <Input
                            id="description"
                            placeholder="Brief description of the scope"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="pt-2 flex justify-end">
                        <Button type="submit" disabled={isLoading || !name.trim()}>
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Create Workspace
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
