import { Metadata } from 'next'
import { ReactNode, Suspense } from 'react'

import { ReduxProvider } from './providers/ReduxProvider'
import MainLayout from './MainLayout'
import { Loader, ToastSnackbar } from '@/shared/ui'

import 'react-toastify/dist/ReactToastify.css'
import '@/styles/globals.css'
import { AuthInitializer } from '@/features/auth/ui/AuthInitializer'

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
          <ToastSnackbar />
          <AuthInitializer />
          <Suspense fallback={<Loader />}>
            <MainLayout>{children}</MainLayout>
          </Suspense>
        </ReduxProvider>
      </body>
    </html>
  )
}
