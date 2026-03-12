import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { authRoutes, adminRoutePrefix } from '@/routes';

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  });

  const isLoggedIn = !!token;
  const role = token?.role as string | undefined;

  // Always pass through API routes — they handle their own auth internally
  if (nextUrl.pathname.startsWith('/api/')) return NextResponse.next();

  const isAuthPage = authRoutes.includes(nextUrl.pathname);
  const isAdminRoute = nextUrl.pathname.startsWith(adminRoutePrefix);
  const isDashboardRoute = nextUrl.pathname.startsWith('/dashboard');

  // Auth pages (login, register, etc.): redirect already-logged-in users to their home
  if (isAuthPage) {
    if (isLoggedIn) {
      const home = role === 'ADMIN' ? '/admin' : '/dashboard';
      return NextResponse.redirect(new URL(home, nextUrl));
    }
    return NextResponse.next();
  }

  // Dashboard and admin require authentication
  if ((isDashboardRoute || isAdminRoute) && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  // Admin routes require ADMIN role — non-admins fall back to /dashboard
  if (isAdminRoute && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', nextUrl));
  }

  // Admins who land on /dashboard are redirected to /admin
  if (isDashboardRoute && role === 'ADMIN') {
    return NextResponse.redirect(new URL('/admin', nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
