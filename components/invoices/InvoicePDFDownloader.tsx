'use client';

import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';

interface InvoiceDetails {
    id: string;
    projectId: string;
    projectName: string;
    totalAmount: number;
    status: string;
    createdAt: Date;
}

export default function InvoicePDFDownloader({ invoice }: { invoice: InvoiceDetails }) {
    const [isGenerating, setIsGenerating] = useState(false);

    const generatePDF = async () => {
        setIsGenerating(true);
        try {
            const doc = new jsPDF();

            // Header
            doc.setFontSize(22);
            doc.setTextColor(40);
            doc.text('INVOICE', 14, 22);

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Invoice ID: ${invoice.id.slice(-8).toUpperCase()}`, 14, 30);
            doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 14, 35);
            doc.text(`Status: ${invoice.status}`, 14, 40);

            // Project Details
            doc.setFontSize(14);
            doc.setTextColor(40);
            doc.text('Billed To Project:', 14, 55);

            doc.setFontSize(11);
            doc.setTextColor(80);
            doc.text(`Project Name: ${invoice.projectName}`, 14, 62);
            doc.text(`Project ID: ${invoice.projectId.slice(-8).toUpperCase()}`, 14, 67);

            // Fetch Approved Budget Items (simulated/fetched from API in real-world, 
            // but we can pass them in if we want more detail. For now, we display the summary.)

            // Table
            autoTable(doc, {
                startY: 80,
                head: [['Description', 'Amount']],
                body: [
                    [`Interior Design Services - ${invoice.projectName}`, `$${invoice.totalAmount.toLocaleString()}`]
                ],
                theme: 'striped',
                headStyles: { fillColor: [41, 128, 185] },
            });

            // Total
            const finalY = (doc as any).lastAutoTable.finalY || 100;
            doc.setFontSize(14);
            doc.setTextColor(40);
            doc.text(`Total Due: $${invoice.totalAmount.toLocaleString()}`, 14, finalY + 15);

            // Footer
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text('Thank you for your business!', 105, 280, { align: 'center' });

            // Save
            doc.save(`Invoice_${invoice.projectName.replace(/\s+/g, '_')}_${invoice.id.slice(-6)}.pdf`);
            toast.success('PDF Downloaded Successfully');
        } catch (error) {
            console.error('Failed to generate PDF:', error);
            toast.error('Failed to generate PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={generatePDF}
            disabled={isGenerating}
        >
            {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            Download PDF
        </Button>
    );
}
