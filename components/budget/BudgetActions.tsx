'use client';

import { Button } from '@/components/ui/button';
import { updateBudgetItemStatus } from '@/app/actions/budget';
import { Check, X } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';

export default function BudgetActions({
    projectId,
    itemId,
    currentStatus
}: {
    projectId: string,
    itemId: string,
    currentStatus: string
}) {
    const [isPending, startTransition] = useTransition();

    const handleStatusUpdate = (newStatus: 'APPROVED' | 'REJECTED') => {
        startTransition(async () => {
            const res = await updateBudgetItemStatus(projectId, itemId, newStatus as any);
            if (res.success) {
                toast.success(`Item ${newStatus.toLowerCase()}`);
            } else {
                toast.error(res.message || 'Failed to update status');
            }
        });
    };

    if (currentStatus !== 'PENDING') {
        return <span className="text-xs text-muted-foreground">{currentStatus}</span>;
    }

    return (
        <div className="flex gap-2">
            <Button
                size="sm"
                variant="outline"
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => handleStatusUpdate('APPROVED')}
                disabled={isPending}
            >
                <Check className="w-4 h-4 mr-1" /> Approve
            </Button>
            <Button
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleStatusUpdate('REJECTED')}
                disabled={isPending}
            >
                <X className="w-4 h-4 mr-1" /> Reject
            </Button>
        </div>
    );
}
