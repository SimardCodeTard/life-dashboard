import { NextRequest, NextResponse } from 'next/server';
import { serverLoginService } from './app/services/server/login.server.service';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api/v1/auth/')) {
    return NextResponse.next();
  }

  const token = req.headers.get('Authorization')?.split(' ')[1] || req.cookies.get('token')?.value;

  if (!token || !serverLoginService.isLoggedIn(token)) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);  
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api', '/dashboard'],
  runtime: 'nodejs',
};
