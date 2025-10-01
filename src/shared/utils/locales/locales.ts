const LOCALES = ['en', 'ru'] as const

export const getLocale = () => {
  if (typeof window === 'undefined') {
    // On server, we can't access window, so return default
    // The actual locale should be handled by Next.js routing
    return 'en'
  }

  const pathname = window.location.pathname
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) return 'en'

  const firstSegment = segments[0]
  return (LOCALES as readonly string[]).includes(firstSegment) ? firstSegment : 'en'
}
