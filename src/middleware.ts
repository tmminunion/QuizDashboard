import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get('quizdash_user');
  const url = request.nextUrl.clone();

  // 1. Jika mencoba akses dashboard (admin) tapi belum login
  if (url.pathname.startsWith('/dashboard') && !userCookie) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 2. Jika sudah login tapi coba buka halaman login lagi
  if (url.pathname === '/login' && userCookie) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // 3. Jika buka root (/) dan sudah login, arahkan ke /dashboard
  //    Jika belum login, biarkan di / (ini nanti akan jadi user dashboard)
  if (url.pathname === '/' && userCookie) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)', // Match semua kecuali API, static, image, favicon
  ],
};
