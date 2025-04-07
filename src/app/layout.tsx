import { Metadata } from 'next'
import { Header } from '@/shared/ui/header/Header'
import { ReduxProvider } from '@/shared/providers/ReduxProvider'
import '@/app/globals.css'
import s from './layout.module.scss'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const metadata: Metadata = {
  title: 'Joyfy',
  description: 'Platform for sharing and discovering visual stories',
	icons: {
		icon: '/favicon.svg',
		apple: 'apple-touch-icon.png',
	}
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
          <ToastContainer />
          <Header isAuthenticated={false} />
          <main className={s.main}>
            <div className={s.mainContainer}>{children}</div>
          </main>
        </ReduxProvider>
      </body>
    </html>
  )
}
