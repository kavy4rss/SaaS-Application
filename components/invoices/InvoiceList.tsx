'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import InvoicePDFDownloader from '@/components/invoices/InvoicePDFDownloader';
import { Filter } from 'lucide-react';

interface InvoiceDetails {
    id: string;
    projectId: string;
    projectName: string;
    totalAmount: number;
    status: string;
    createdAt: Date;
}

export default function InvoiceList({ initialInvoices }: { initialInvoices: InvoiceDetails[] }) {
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'PAID'>('ALL');

    const filteredInvoices = initialInvoices.filter(inv => {
        if (filter === 'ALL') return true;
        return inv.status === filter;
    });

    return (
        <div className="space-y-4 pt-4">
            <div className="flex justify-end gap-2 mb-4">
                <Button
                    variant={filter === 'ALL' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('ALL')}
                >
                    <Filter className="w-3 h-3 mr-1" /> All
                </Button>
                <Button
                    variant={filter === 'PENDING' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('PENDING')}
                >
                    Pending
                </Button>
                <Button
                    variant={filter === 'PAID' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('PAID')}
                >
                    Paid
                </Button>
            </div>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice ID</TableHead>
                            <TableHead>Project</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredInvoices.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                                    No invoices found matching the current filter.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredInvoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-mono text-sm text-muted-foreground">
                                        {invoice.id.slice(-8).toUpperCase()}
                                    </TableCell>
                                    <TableCell className="font-medium">{invoice.projectName}</TableCell>
                                    <TableCell>{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>${invoice.totalAmount.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={invoice.status === 'PAID' ? 'default' : 'secondary'}>
                                            {invoice.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <InvoicePDFDownloader invoice={invoice} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
