import { Metadata } from 'next'
import { Header } from '@/shared/ui/header/Header'
import { ReduxProvider } from '@/app/providers/ReduxProvider'
import '@/styles/globals.css'
import s from '../styles/layout.module.scss'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from '@/app/providers/AuthProvider'
import { ToastSnackbar } from '@/shared/ui/toastSnackbar/ToastSnackbar'

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
          <AuthProvider>
            <ToastSnackbar />
            <Header />
            <main className={s.main}>
              <div className={s.mainContainer}>{children}</div>
            </main>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
