import { Metadata } from 'next'
import { ReactNode, Suspense } from 'react'

import { ReduxProvider } from './providers/ReduxProvider'
import MainLayout from './MainLayout'
import { Loader, ToastSnackbar } from '@/shared/ui'

import 'react-toastify/dist/ReactToastify.css'
import '@/styles/globals.css'
import { SocketProvider } from '@/features/notifications/context/SocketContext'

export const metadata: Metadata = {
  title: 'Joyfy',
  description: 'Platform for sharing and discovering visual stories',
  icons: {
    icon: '/fav.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <SocketProvider>
            <ToastSnackbar />
            <Suspense fallback={<Loader />}>
              <MainLayout>{children}</MainLayout>
            </Suspense>
          </SocketProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
