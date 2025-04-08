import { Metadata } from 'next'
import { ReduxProvider } from './providers/ReduxProvider'
import { AuthProvider } from './providers/AuthProvider'
import { ToastContainer } from 'react-toastify'
import MainLayout from './MainLayout'

import 'react-toastify/dist/ReactToastify.css'
import '@/styles/globals.css'

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
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
            />
            <MainLayout>{children}</MainLayout>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
