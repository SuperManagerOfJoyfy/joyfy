import type { ReactNode } from 'react'

export const metadata = {
  title: 'Joyfy',
  description: 'Platform for sharing and discovering visual stories',
  icons: { icon: '/fav.svg' },
}

type RootLayoutProps = {
  children: ReactNode
  params?: Promise<{ locale?: string }>
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  let locale = 'en'
  if (params) {
    try {
      const resolvedParams = await params
      locale = resolvedParams.locale || 'en'
    } catch {}
  }

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  )
}
