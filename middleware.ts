import { NextRequest, NextResponse } from 'next/server';
import { serverLoginService } from './app/services/server/login.server.service';
import { Logger } from './app/services/logger.service';

export function middleware(req: NextRequest) {
  Logger.debug('middleware');
  if (req.nextUrl.pathname.startsWith('/api/v1/auth/')) {
    return NextResponse.next();
  }

  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token || !serverLoginService.isLoggedIn(token)) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api', '/dashboard'],
  runtime: 'nodejs',
};
