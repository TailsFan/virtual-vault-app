import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isAssetPath(pathname: string): boolean {
  if (pathname.startsWith('/_next')) return true;
  if (pathname.startsWith('/api')) return false;
  const assetExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico', '.css', '.js', '.map'];
  return assetExtensions.some((ext) => pathname.endsWith(ext));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAssetPath(pathname)) {
    return NextResponse.next();
  }

  const user = process.env.BASIC_AUTH_USER;
  const pass = process.env.BASIC_AUTH_PASS;

  // If not configured, allow free access
  if (!user || !pass) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    const [scheme, encoded] = authHeader.split(' ');
    if (scheme === 'Basic' && encoded) {
      const decoded = Buffer.from(encoded, 'base64').toString('utf8');
      const [u, p] = decoded.split(':');
      if (u === user && p === pass) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Protected"',
    },
  });
}

export const config = {
  matcher: [
    // Protect everything except static files and public assets
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};


