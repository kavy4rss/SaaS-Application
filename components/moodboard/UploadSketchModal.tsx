'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { saveSketchToDatabase } from '@/app/actions/sketches';
import { UploadDropzone } from '@/lib/uploadthing';

export default function UploadSketchModal({ projectId }: { projectId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                    <Plus className="w-4 h-4" /> Upload Sketch
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Upload to Moodboard</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium">Title (Optional)</label>
                        <Input
                            id="title"
                            placeholder="e.g. Master Bedroom Concepts"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="pt-2">
                        <UploadDropzone
                            endpoint="moodboardImage"
                            onClientUploadComplete={async (res) => {
                                if (!res || res.length === 0) return;

                                const uploadedUrl = res[0].url;

                                // Persist to database using the Server Action
                                const dbRes = await saveSketchToDatabase(projectId, uploadedUrl, title || 'Untitled');
                                if (dbRes.success) {
                                    toast.success('Sketch uploaded successfully!');
                                    setIsOpen(false);
                                    setTitle('');
                                } else {
                                    toast.error(dbRes.message || 'Error saving sketch details');
                                }
                            }}
                            onUploadError={(error: Error) => {
                                toast.error(`Upload error: ${error.message}`);
                            }}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
