import type { ReactNode } from 'react'
import { Suspense } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'

import 'react-toastify/dist/ReactToastify.css'
import '@/styles/globals.css'

import MainLayout from './MainLayout'
import { ReduxProvider } from '../providers/ReduxProvider'
import { AuthInitializer } from '@/features/auth/ui/AuthInitializer'
import { Loader, ToastSnackbar } from '@/shared/ui'

export const metadata = {
  title: 'Joyfy',
  description: 'Platform for sharing and discovering visual stories',
  icons: { icon: '/fav.svg' },
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <ReduxProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ToastSnackbar />
            <AuthInitializer />
            <Suspense fallback={<Loader />}>
              <MainLayout>{children}</MainLayout>
            </Suspense>
          </NextIntlClientProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
