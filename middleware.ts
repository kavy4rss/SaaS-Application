import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const userRole = req.auth?.user?.role;

    const isDashboard = req.nextUrl.pathname.startsWith('/dashboard');
    const isOnboarding = req.nextUrl.pathname.startsWith('/onboarding');
    const isLogin = req.nextUrl.pathname.startsWith('/login');

    if (isLoggedIn) {
        if (!userRole && !isOnboarding) {
            return NextResponse.redirect(new URL('/onboarding', req.nextUrl.origin));
        }
        if (userRole && isOnboarding) {
            return NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin));
        }
        if (isLogin) {
            return NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin));
        }
    }

    if (isDashboard && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', req.nextUrl.origin));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
