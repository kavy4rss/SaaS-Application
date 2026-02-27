'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { updateProjectProgress } from '@/app/actions/project';
import { useDebounce } from '@/hooks/useDebounce'; // Assuming we have or will write a simple debounce

export default function ProjectProgressSlider({
    projectId,
    initialProgress,
    isAdmin
}: {
    projectId: string,
    initialProgress: number,
    isAdmin: boolean
}) {
    const [progress, setProgress] = useState(initialProgress);
    const [isUpdating, setIsUpdating] = useState(false);

    // If not Admin, just show the display progress bar
    if (!isAdmin) {
        return <Progress value={progress} className="h-2" />;
    }

    const handleValueChange = (vals: number[]) => {
        setProgress(vals[0]);
    };

    const handleCommit = async (vals: number[]) => {
        const newProgress = vals[0];
        setIsUpdating(true);
        try {
            const res = await updateProjectProgress(projectId, newProgress);
            if (res.success) {
                toast.success('Project progress updated!');
            } else {
                toast.error(res.message);
                setProgress(initialProgress); // Revert on failure
            }
        } catch (error) {
            toast.error('Failed to update project progress');
            setProgress(initialProgress);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="space-y-4">
            <Slider
                value={[progress]}
                onValueChange={handleValueChange}
                onValueCommit={handleCommit}
                max={100}
                step={5}
                disabled={isUpdating}
                className={isUpdating ? "opacity-50" : ""}
            />
        </div>
    );
}
