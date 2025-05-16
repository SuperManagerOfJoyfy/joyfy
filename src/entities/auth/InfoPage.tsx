import { Typography } from '@/shared/ui/typography'
import s from './InfoPage.module.scss'
import { Button } from '@/shared/ui'
import Link from 'next/link'
import { ReactNode } from 'react'

export const InfoPage = ({ children, title }: { children: ReactNode; title: string }) => {
  return (
    <div className={s.infoContainer}>
      <Button
        as={Link}
        href="/auth/registration"
        variant="text"
        startIcon={<span>←</span>}
        className={s.backButton}
        noPadding
        customStyles
      >
        Back to Sign Up
      </Button>
      <Typography variant="h1" as="h1">
        {title}
      </Typography>
      {children}
    </div>
  )
}
