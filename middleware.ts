import createMiddleware from 'next-intl/middleware'
import { routing } from './src/i18n/routing'
import { NextRequest } from 'next/server'

const intlMiddleware = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/auth/google') || pathname.startsWith('/auth/github')) {
    return
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|api|favicon.ico|auth/google|auth/github|.*\\..*|oauth).*)', '/'],
}
