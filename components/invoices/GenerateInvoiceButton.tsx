'use client';

import { Button } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { generateInvoice } from '@/app/actions/invoice';
import { toast } from 'sonner';

export default function GenerateInvoiceButton({ projectId }: { projectId: string }) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const res = await generateInvoice(projectId);
            if (res.success) {
                toast.success('Invoice generated successfully!');
            } else {
                toast.error(res.message || 'Failed to generate invoice.');
            }
        } catch (error) {
            toast.error('An unexpected error occurred.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            size="sm"
        >
            {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
            Generate Invoice
        </Button>
    );
}
