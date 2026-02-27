import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { X, Loader2 } from 'lucide-react';

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: { name: string }) => Promise<void>;
}

export default function CreateProjectModal({ isOpen, onClose, onAdd }: CreateProjectModalProps) {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;

        setIsSubmitting(true);
        try {
            await onAdd({ name });
            setName('');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg shadow-lg border-border bg-card">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-semibold text-foreground">Create New Project</h2>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <Label>Project Title</Label>
                        <Input
                            id="name"
                            placeholder="Enter a name for this workspace..."
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-12 text-lg px-4"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting || !name} className="min-w-[140px] h-11">
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Workspace'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
