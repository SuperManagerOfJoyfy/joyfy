import createMiddleware from 'next-intl/middleware'
import { routing } from './src/i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!_next/static|_next/image|api|favicon.ico|.*\\..*|oauth).*)', '/'],
}
