import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { X, Loader2 } from 'lucide-react';

interface AddInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: { number: string; description: string; amount: number; due_date: string; payment_link: string }) => Promise<void>;
}

export default function AddInvoiceModal({ isOpen, onClose, onAdd }: AddInvoiceModalProps) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [number, setNumber] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [paymentLink, setPaymentLink] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !amount || !number || !dueDate) return;

        setIsSubmitting(true);
        try {
            await onAdd({
                number,
                description,
                amount: parseFloat(amount),
                due_date: dueDate,
                payment_link: paymentLink
            });
            // Reset form on success
            setDescription('');
            setAmount('');
            setNumber('');
            setDueDate('');
            setPaymentLink('');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg shadow-lg border-border bg-card">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-semibold text-foreground">Generate Invoice</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="number">Invoice Number *</Label>
                            <Input
                                id="number"
                                placeholder="INV-001"
                                required
                                value={number}
                                onChange={(e) => setNumber(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount ($) *</Label>
                            <Input
                                id="amount"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="2500.00"
                                required
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Input
                            id="description"
                            placeholder="Design consultation fee"
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date *</Label>
                        <Input
                            id="dueDate"
                            type="date"
                            required
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="paymentLink">Payment Link (Stripe, optional)</Label>
                        <Input
                            id="paymentLink"
                            type="url"
                            placeholder="https://buy.stripe.com/..."
                            value={paymentLink}
                            onChange={(e) => setPaymentLink(e.target.value)}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !description || !amount || !number || !dueDate}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[100px]"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
