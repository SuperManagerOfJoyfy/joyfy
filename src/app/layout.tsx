import { Metadata } from 'next'
import { Header } from '@/shared/ui/header/Header'
import { ReduxProvider } from '@/shared/providers/ReduxProvider'
import '@/app/globals.css'
import s from './layout.module.scss'

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
          <main className={s.main}>
            <div className={s.mainContainer}>{children}</div>
          </main>
        </ReduxProvider>
      </body>
    </html>
  )
}
