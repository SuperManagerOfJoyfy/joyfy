import { Metadata } from 'next'
import { ReactNode } from 'react'

import { ReduxProvider } from './providers/ReduxProvider'
import MainLayout from './MainLayout'
import { ToastSnackbar } from '@/shared/ui'

import 'react-toastify/dist/ReactToastify.css'
import '@/styles/globals.css'

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
          <MainLayout>{children}</MainLayout>
        </ReduxProvider>
      </body>
    </html>
  )
}
