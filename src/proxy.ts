import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Routes that require authentication.
 * If the `jwt` HTTP-only cookie is absent the user is redirected to /login.
 */
const PROTECTED_PREFIXES = ['/dashboard', '/admin', '/committees', '/profile', '/notifications', '/assistant'];

/**
 * Routes that are only accessible to unauthenticated users.
 * Authenticated users are redirected away from /login and /register.
 */
const AUTH_ROUTES = ['/login', '/register'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const jwt = request.cookies.get('jwt')?.value;

  // Redirect authenticated users away from auth pages
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (jwt) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protect routes that require authentication
  if (PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    if (!jwt) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on all page routes; exclude static assets, API routes, and image optimiser
    '/((?!_next/static|_next/image|api|favicon.ico|.*\\.svg$|.*\\.png$).*)',
  ],
};
