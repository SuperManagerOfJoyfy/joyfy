import { InfoPage } from '@/entities/auth/InfoPage'
import { PrivacyPolicy } from '@/entities/auth/PrivacyPolicy'
import { getTranslations } from 'next-intl/server'
import { setRequestLocale } from 'next-intl/server'

type Props = { params: { locale: string } }

export default async function Page({ params: { locale } }: Props) {
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'infoPage' })

  return (
    <InfoPage title={t('privacyPolicyTitle')}>
      <PrivacyPolicy />
    </InfoPage>
  )
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ru' }, { locale: 'uk' }]
}
