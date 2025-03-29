import { NextRequest, NextResponse } from 'next/server';
import { serverLoginService } from './app/services/server/login.server.service';
import { CookieNamesEnum } from './app/enums/cookies.enum';

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api/v1/auth/')) {
    return NextResponse.next();
  }

  const token = req.cookies.get(CookieNamesEnum.AUTH_TOKEN)?.value;

  if (!token || !(await serverLoginService.isLoggedIn(token))
  ) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);  
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!login|_next|public|static|favicon.ico|middleware).*)',
  runtime: 'nodejs',
};
