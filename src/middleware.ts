import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('PortFolioAdminAccessToken')?.value;

  // Store current request url in a custom header, which you can read later
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-url', pathname);

  if (accessToken && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!accessToken && pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next({
    request: {
      // Apply new request headers
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/dashboard', '/'],
};
