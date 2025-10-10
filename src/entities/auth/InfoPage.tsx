'use client'

import { ReactNode, useCallback } from 'react'
import { useTranslations } from 'next-intl'

import { Typography } from '@/shared/ui/typography'
import { Button } from '@/shared/ui'
import { PATH } from '@/shared/config/routes'
import { useRouter } from '@/i18n/navigation'

import s from './InfoPage.module.scss'

type InfoPageProps = {
  title: string
  children: ReactNode
}

export const InfoPage = ({ title, children }: InfoPageProps) => {
  const t = useTranslations('infoPage')
  const router = useRouter()

  const handleBack = useCallback(() => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(PATH.AUTH.REGISTRATION)
    }
  }, [router])

  return (
    <div className={s.infoContainer}>
      <Button
        as="a"
        variant="text"
        startIcon={<span>←</span>}
        className={s.backButton}
        noPadding
        customStyles
        onClick={handleBack}
      >
        {t('back')}
      </Button>

      <Typography as="h1" variant="h1">
        {title}
      </Typography>

      {children}
    </div>
  )
}
