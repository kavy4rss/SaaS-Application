import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT!, // e.g. https://<account_id>.r2.cloudflarestorage.com
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY!,
        secretAccessKey: process.env.R2_SECRET_KEY!,
    },
});

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { filename, contentType } = await req.json();

        if (!filename || !contentType) {
            return NextResponse.json({ error: 'Missing filename or content type' }, { status: 400 });
        }

        // Sanitize filename to prevent directory traversal or unusual characters
        const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
        const key = `sketches/${session.user.id}/${Date.now()}-${safeFilename}`;

        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: key,
            ContentType: contentType,
        });

        // Generate the presigned URL valid for 1 hour
        const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        // Provide the public URL assuming R2_PUBLIC_URL is configured in .env 
        // Example: https://pub-xxxxxxxxxx.r2.dev
        const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

        return NextResponse.json({ url: presignedUrl, key, publicUrl });
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
    }
}
