import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

/**
 * Routes that require authentication.
 * If the `jwt` HTTP-only cookie is absent the user is redirected to /login.
 * Admin routes are handled separately below.
 */
const PROTECTED_PREFIXES = ['/dashboard', '/committees', '/profile', '/notifications', '/assistant', '/invitations'];

/**
 * Routes that are only accessible to unauthenticated users.
 * Authenticated users are redirected away from /login and /register.
 */
const AUTH_ROUTES = ['/login', '/register'];

/**
 * Asks the backend for the authenticated user's role by forwarding the
 * `jwt` cookie to GET /auth/me. The backend is the source of truth for
 * authorisation — this check only improves navigation UX.
 *
 * Returns null when the role cannot be determined (e.g. the backend is
 * unreachable) so the request falls through to the client-side guards
 * instead of locking the user out.
 */
async function getUserRole(jwt: string): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { cookie: `jwt=${jwt}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const user = (await res.json()) as { role?: string };
    return user.role ?? null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const jwt = request.cookies.get('jwt')?.value;

  // Redirect authenticated users away from auth pages —
  // admins land on /admin, everyone else on /dashboard.
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (jwt) {
      const role = await getUserRole(jwt);
      const destination = role === 'ADMIN' ? '/admin' : '/dashboard';
      return NextResponse.redirect(new URL(destination, request.url));
    }
    return NextResponse.next();
  }

  // Admin routes require the ADMIN role: unauthenticated users are sent to
  // /login, authenticated non-admins are redirected to their dashboard.
  if (pathname.startsWith('/admin')) {
    if (!jwt) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    const role = await getUserRole(jwt);
    if (role && role !== 'ADMIN') {
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
