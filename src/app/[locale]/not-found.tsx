'use client'

import { useTranslations } from 'next-intl'
import { NotFoundContent } from '@/shared/ui'
import { PATH } from '@/shared/config/routes'

export default function NotFound() {
  const t = useTranslations('notFound')

  return <NotFoundContent title={t('title')} description={t('description')} buttonText={t('button')} href={PATH.ROOT} />
}
