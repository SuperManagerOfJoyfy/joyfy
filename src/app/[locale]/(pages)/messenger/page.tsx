'use client'

import { useTranslations } from 'next-intl'
import s from './MessengerPage.module.scss'

export default function Page() {
  const t = useTranslations('messenger')
  return (
    <div className={s.container}>
      <p className={s.banner}>{t('banner')}</p>
    </div>
  )
}
