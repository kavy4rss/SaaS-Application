import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const userCount = await prisma.user.count();
        return NextResponse.json({
            success: true,
            time: new Date().toISOString(),
            userCount,
            message: 'Database connection is warm.'
        });
    } catch (error) {
        console.error('Error hitting database heartbeat:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
