'use client'

import { useTranslations } from 'next-intl'

import { Typography } from '@/shared/ui'
import { AuthGuard } from '@/features/auth/ui'

export default function Statistics() {
  const t = useTranslations('statistics')

  return (
    <AuthGuard requireAuth>
      <Typography variant="h1">{t('title')}</Typography>
    </AuthGuard>
  )
}
