import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware placeholder — currently allows all requests
export function middleware(request: NextRequest) {
  // Future: Add authentication or access control logic here

  return NextResponse.next()
}

// Matcher: applies middleware to all routes except for static assets and favicon
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
