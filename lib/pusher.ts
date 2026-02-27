import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

// Server-side Pusher instance (used in API routes / Server Actions to trigger events)
export const pusherServer = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    useTLS: true,
});

// Client-side Pusher instance (used in React hooks to subscribe to events)
// We declare this as a singleton to avoid multiple connections across hot-reloads
export const pusherClient =
    (typeof window !== 'undefined')
        ? new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        })
        : null;
