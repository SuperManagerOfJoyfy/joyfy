'use client'

import { createEmailSchema } from '@/features/auth/utils/schemas/EmailSchema'
import { PATH } from '@/shared/config/routes'
import { Form, Recaptcha, Typography } from '@/shared/ui'
import { Card } from '@/shared/ui/card'
import clsx from 'clsx'
import { Fragment, useMemo, useState } from 'react'
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
  serverError?: string
  successDescription: boolean
}

export type ForgotPasswordFormValues = z.infer<ReturnType<typeof makeForgotPasswordSchema>>

export const ForgotPassword = ({
  className,
  isLoading,
  onSubmitAction,
  siteKey,
  serverError,
  successDescription,
}: Props) => {
  const t = useTranslations('auth.forgotPassword')
  const tv = useTranslations('auth.validation')

  const forgotPasswordSchema = useMemo(() => makeForgotPasswordSchema(tv), [tv])
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [recaptchaRequiredError, setRecaptchaRequiredError] = useState(false)

  const fields = [{ name: 'email' as const, label: t('fields.email'), type: 'email' }]

  const recaptchaMessages = {
    required: tv('required'),
    failed: tv('recaptchaFailed'),
    expired: tv('recaptchaExpired'),
    error: tv('recaptchaError'),
  }

  const handleSubmit = (data: Omit<ForgotPasswordFormValues, 'recaptcha'>) => {
    if (!recaptchaToken) {
      setRecaptchaRequiredError(true)
      return
    }

    const finalData: ForgotPasswordFormValues = {
      ...data,
      recaptcha: recaptchaToken,
    }

    onSubmitAction(finalData)
    setRecaptchaRequiredError(false)
  }
  const additionalContent = (
    <div>
      <Typography variant={'body2'} className={s.label}>
        {t('description')}
      </Typography>
      {successDescription && <Typography variant={'body2'}>{t('successDescription')}</Typography>}
    </div>
  )

  return (
    <Card className={clsx(s.card, className)}>
      <Typography className={s.title} variant="h1">
        {t('title')}
      </Typography>

      <Form
        btnText={t('button')}
        fields={fields}
        schema={forgotPasswordSchema.omit({ recaptcha: true })}
        onSubmit={handleSubmit}
        disabled={isLoading}
        serverError={serverError ? { field: 'email', message: serverError } : null}
        additionalContent={additionalContent}
      />

      <Link href={PATH.AUTH.LOGIN} aria-disabled={isLoading} className={s.BackToSignIn}>
        {t('footerLink')}
      </Link>
      <Recaptcha
        siteKey={siteKey}
        onVerifyAction={setRecaptchaToken}
        showRequiredError={recaptchaRequiredError}
        messages={recaptchaMessages}
      />
    </Card>
  )
}
