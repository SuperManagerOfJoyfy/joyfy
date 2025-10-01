'use client'

import { SocialLinks } from '@/features/auth/ui/socialLinks'
import { EmailSchema } from '@/features/auth/utils/schemas/EmailSchema'
import { PATH } from '@/shared/config/routes'
import { Form, Typography } from '@/shared/ui'
import { Card } from '@/shared/ui/card'
import clsx from 'clsx'
import { useState } from 'react'
import { z } from 'zod'
import s from './login.module.scss'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

const loginSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, 'Required'),
})

type Props = {
  className?: string
  isLoading: boolean
  onSubmit: (data: LoginFormValues) => void
}

export type LoginFormValues = z.infer<typeof loginSchema>

export const Login = ({ className, isLoading, onSubmit }: Props) => {
  const t = useTranslations('auth.login')
  const [isSocialLoading, setIsSocialLoading] = useState(false)

  const fields = [
    { name: 'email' as const, label: t('fields.email'), type: 'email' },
    { name: 'password' as const, label: t('fields.password'), type: 'password' },
  ]

  const additionalContent = (
    <div className={s.content}>
      <Link
        href="/auth/new-password" // TODO
        aria-disabled={isSocialLoading || isLoading}
        className={s.forgot}
      >
        {t('forgotPassword')}
      </Link>
    </div>
  )

  return (
    <Card className={clsx(s.card, className)}>
      <Typography variant="h1">{t('title')}</Typography>

      <div className={s.socialLinksWrap}>
        <SocialLinks isDisabled={isSocialLoading || isLoading} onStartLoading={() => setIsSocialLoading(true)} />
      </div>

      <Form
        btnText={t('button')}
        fields={fields}
        schema={loginSchema}
        onSubmit={onSubmit}
        additionalContent={additionalContent}
        disabled={isSocialLoading || isLoading}
      />

      <Typography variant="body1" className={s.account}>
        {t('footerQuestion')}
      </Typography>

      <Link href={PATH.AUTH.REGISTRATION} aria-disabled={isSocialLoading || isLoading} className={s.signUp}>
        {t('footerLink')}
      </Link>
    </Card>
  )
}
