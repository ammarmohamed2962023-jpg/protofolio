import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'super_secret_enterprise_cms_jwt_key_2026'
);
const COOKIE_NAME = 'cms_session';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only run middleware on /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  let payload = null;

  if (token) {
    try {
      const verified = await jwtVerify(token, JWT_SECRET, { algorithms: ['HS256'] });
      payload = verified.payload;
    } catch (err) {
      payload = null;
    }
  }

  const isLoginPage = pathname === '/admin/login';

  // 1. If accessing login page while authenticated -> redirect to /admin
  if (isLoginPage && payload) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // 2. Allow unauthenticated access to login page
  if (isLoginPage) {
    return NextResponse.next();
  }

  // 3. Unauthenticated user trying to access protected /admin routes -> redirect to /admin/login
  if (!payload) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Role-based Access Control (RBAC): restrict sensitive admin settings to ADMIN role
  if (pathname.startsWith('/admin/settings') && payload.role !== 'ADMIN') {
    const forbiddenUrl = new URL('/admin', request.url);
    forbiddenUrl.searchParams.set('error', 'forbidden');
    return NextResponse.redirect(forbiddenUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
