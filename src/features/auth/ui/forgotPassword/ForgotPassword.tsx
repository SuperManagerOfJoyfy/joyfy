'use client'

import { createEmailSchema } from '@/features/auth/utils/schemas/EmailSchema'
import { PATH } from '@/shared/config/routes'
import { Form, Recaptcha, Typography } from '@/shared/ui'
import { Card } from '@/shared/ui/card'
import clsx from 'clsx'
import { useMemo, useState } from 'react'
import { z } from 'zod'
import s from './forgotPassword.module.scss'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

const makeForgotPasswordSchema = (tv: ReturnType<typeof useTranslations>) =>
  z.object({
    email: createEmailSchema({
      required: tv('required'),
      email: tv('email'),
    }),
    recaptcha: z.string({ required_error: tv('required') }),
  })

type Props = {
  className?: string
  isLoading: boolean
  onSubmitAction: (data: ForgotPasswordFormValues) => void
  siteKey: string
}

export type ForgotPasswordFormValues = z.infer<ReturnType<typeof makeForgotPasswordSchema>>

export const ForgotPassword = ({ className, isLoading, onSubmitAction, siteKey }: Props) => {
  const t = useTranslations('auth.forgotPassword')
  const tv = useTranslations('auth.validation')

  const forgotPasswordSchema = useMemo(() => makeForgotPasswordSchema(tv), [tv])
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)

  const fields = [{ name: 'email' as const, label: t('fields.email'), type: 'email' }]

  const handleSubmit = (data: Omit<ForgotPasswordFormValues, 'recaptcha'>) => {
    if (!recaptchaToken) {
      alert(tv('required'))
      return
    }

    const finalData: ForgotPasswordFormValues = {
      ...data,
      recaptcha: recaptchaToken,
    }

    onSubmitAction(finalData)
  }

  return (
    <Card className={clsx(s.card, className)}>
      <Typography variant="h1">{t('title')}</Typography>

      <Form
        btnText={t('button')}
        fields={fields}
        schema={forgotPasswordSchema.omit({ recaptcha: true })}
        onSubmit={handleSubmit}
        disabled={isLoading}
      />
      <Typography variant="caption2">{t('description')}</Typography>
      <Link href={PATH.AUTH.LOGIN} aria-disabled={isLoading} className={s.signUp}>
        {t('footerLink')}
      </Link>
      <Recaptcha siteKey={siteKey} onVerifyAction={setRecaptchaToken} />
    </Card>
  )
}
