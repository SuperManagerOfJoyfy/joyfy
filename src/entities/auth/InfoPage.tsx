'use client'

import { Typography } from '@/shared/ui/typography'
import s from './InfoPage.module.scss'
import { Button } from '@/shared/ui'
import { ReactNode } from 'react'
import { Link } from '@/i18n/navigation'
import { PATH } from '@/shared/config/routes'
import { useTranslations } from 'next-intl'

export const InfoPage = ({ children, title }: { children: ReactNode; title: string }) => {
  const t = useTranslations('infoPage')

  return (
    <div className={s.infoContainer}>
      <Button
        as={Link}
        href={PATH.AUTH.REGISTRATION}
        variant="text"
        startIcon={<span>←</span>}
        className={s.backButton}
        noPadding
        customStyles
      >
        {t('backToSignup')}
      </Button>
      <Typography variant="h1" as="h1">
        {title}
      </Typography>
      {children}
    </div>
  )
}
