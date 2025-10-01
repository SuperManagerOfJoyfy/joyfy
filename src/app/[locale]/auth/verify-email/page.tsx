'use client'

import { useTranslations } from 'next-intl'

const Page = () => {
  const t = useTranslations('verifyEmail')
  return <div className="container">{t('title')}</div>
}

export default Page
