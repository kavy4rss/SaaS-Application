import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// This route keeps the Neon serverless Postgres database "warm" to prevent cold starts
// A GitHub action will routinely hit this endpoint every 4 minutes.
export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;

        // Security Verification: Only allow requests bearing the exact CRON_SECRET token
        if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json(
                { error: 'Unauthorized. Invalid or missing CRON_SECRET.' },
                { status: 401 }
            );
        }

        // Ping the Database
        const start = performance.now();
        const count = await prisma.user.count();
        const duration = performance.now() - start;

        return NextResponse.json({
            success: true,
            message: 'Database connection is warm.',
            pingDurationMs: Math.round(duration),
            activeUsers: count,
        });
    } catch (error: any) {
        console.error('Keep-Alive Ping Failed:', error);
        return NextResponse.json(
            { error: 'Failed to connect to database in Keep-Alive.' },
            { status: 500 }
        );
    }
}
