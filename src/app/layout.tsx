import { Metadata } from 'next'
import { ReduxProvider } from './providers/ReduxProvider'
import { AuthProvider } from './providers/AuthProvider'
import MainLayout from './MainLayout'

import 'react-toastify/dist/ReactToastify.css'
import '@/styles/globals.css'
import { ToastSnackbar } from '@/shared/ui/toastSnackbar/ToastSnackbar'

export const metadata: Metadata = {
  title: 'Joyfy',
  description: 'Platform for sharing and discovering visual stories',
  icons: {
    icon: '/favicon.svg',
    apple: 'apple-touch-icon.png',
  },
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
            <MainLayout>{children}</MainLayout>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
