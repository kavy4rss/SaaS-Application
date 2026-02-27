'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Plus } from 'lucide-react';

interface AddBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { name: string; category: string; cost: number; notes: string }) => void;
}

const categories = [
  'Materials',
  'Furniture',
  'Fixtures',
  'Furnishings',
  'Labor',
  'Other',
];

export default function AddBudgetModal({ isOpen, onClose, onAdd }: AddBudgetModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Materials');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !cost) return;

    onAdd({
      name,
      category,
      cost: parseFloat(cost),
      notes,
    });
    setName('');
    setCategory('Materials');
    setCost('');
    setNotes('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border bg-card">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Add Budget Item</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Item Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Italian Marble Countertop"
              className="w-full px-3 py-2 rounded border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Cost */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Cost ($) *
            </label>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full px-3 py-2 rounded border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional details about this item..."
              rows={3}
              className="w-full px-3 py-2 rounded border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isSubmitting || !name || !cost}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Adding...' : 'Add Item'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
