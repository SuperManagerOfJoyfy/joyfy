import { setRequestLocale } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { routing } from '@/i18n/routing'

export default async function InitPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  setRequestLocale(locale)

  if (!routing.locales.includes(locale as any)) {
    redirect(`/${routing.defaultLocale}`)
  }

  return null
}
