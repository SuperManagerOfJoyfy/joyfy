import { Metadata } from 'next'
import { Header } from '@/shared/ui/header/Header'
import { ReduxProvider } from '@/shared/providers/ReduxProvider'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: 'Joyfy',
  description: 'bla-bla',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <Header isAuthenticated={false} />
          <main>{children}</main>
        </ReduxProvider>
      </body>
    </html>
  )
}
