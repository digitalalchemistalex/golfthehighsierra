import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Serve the custom HTML homepage for the root path
  if (request.nextUrl.pathname === '/') {
    return NextResponse.rewrite(new URL('/homepage.html', request.url));
  }
}

export const config = {
  matcher: ['/'],
};
