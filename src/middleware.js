import { NextResponse } from 'next/server';
import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Skip auth routes completely — never block /api/auth/*
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Protect dashboard and settings
  return withMiddlewareAuthRequired()(req);
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings', '/api/auth/:path*'],
};
