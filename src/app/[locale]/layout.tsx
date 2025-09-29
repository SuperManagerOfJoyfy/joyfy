import type { ReactNode } from 'react'
import { Suspense } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'

import 'react-toastify/dist/ReactToastify.css'
import '@/styles/globals.css'

import MainLayout from './MainLayout'
import { ReduxProvider } from '../providers/ReduxProvider'
import { AuthInitializer } from '@/features/auth/ui/AuthInitializer'
import { Loader, ToastSnackbar } from '@/shared/ui'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: { locale: string } }) {
  const { locale } = params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <ReduxProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ToastSnackbar />
        <AuthInitializer />
        <Suspense fallback={<Loader />}>
          <MainLayout>{children}</MainLayout>
        </Suspense>
      </NextIntlClientProvider>
    </ReduxProvider>
  )
}
