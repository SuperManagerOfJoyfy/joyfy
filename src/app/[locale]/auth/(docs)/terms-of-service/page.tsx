import { InfoPage } from '@/entities/auth/InfoPage'
import { TermsAndServices } from '@/entities/auth/TermsAndServices'
import { setRequestLocale } from 'next-intl/server'

type PageProps = {
  params: Promise<{ locale: 'en' | 'ru' }>
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const terms = (await import(`../../../../../../locales/termsOfService.${locale}.json`)).default as TermsJson

  return (
    <InfoPage title={terms.title}>
      <TermsAndServices terms={terms} />
    </InfoPage>
  )
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ru' }]
}

type TermsJson = {
  title: string
  intro: string
  sections: Record<string, { title: string; content: string }>
  footer: string
}
