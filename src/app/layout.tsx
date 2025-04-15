import { Metadata } from 'next'
import { ReduxProvider } from './providers/ReduxProvider'
import MainLayout from './MainLayout'

import 'react-toastify/dist/ReactToastify.css'
import '@/styles/globals.css'
import { ToastSnackbar } from '@/shared/ui/toastSnackbar/ToastSnackbar'

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
  children: React.ReactNode
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
