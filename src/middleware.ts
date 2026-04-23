import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get('quizdash_user');
  const url = request.nextUrl.clone();

  // 1. Jika mencoba akses dashboard tapi belum login
  if (url.pathname.startsWith('/dashboard') && !userCookie) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 2. Jika sudah login tapi coba buka halaman login lagi
  if (url.pathname === '/login' && userCookie) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // 3. Jika buka root (/)
  if (url.pathname === '/') {
    url.pathname = userCookie ? '/dashboard' : '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
