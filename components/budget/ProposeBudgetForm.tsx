'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { proposeBudgetItem } from '@/app/actions/budget';

export default function ProposeBudgetForm({ projectId }: { projectId: string }) {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !amount) return;

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            toast.error('Please enter a valid amount greater than 0');
            return;
        }

        setIsLoading(true);
        try {
            const res = await proposeBudgetItem(projectId, title, parsedAmount);
            if (res.success) {
                toast.success('Budget item proposed!');
                setTitle('');
                setAmount('');
            } else {
                toast.error(res.message || 'Failed to propose item');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-lg mb-4">
            <Input
                placeholder="Item Description (e.g. 3D Renderings)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1"
                required
            />
            <div className="relative w-32">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground text-sm">
                    $
                </div>
                <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-7"
                    required
                    min="1"
                    step="0.01"
                />
            </div>
            <Button type="submit" disabled={isLoading || !title.trim() || !amount}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span className="ml-2 hidden sm:inline">Propose</span>
            </Button>
        </form>
    );
}
