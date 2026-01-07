'use client'

import { Form, Typography } from '@/shared/ui'
import { Card } from '@/shared/ui/card'
import clsx from 'clsx'
import { useMemo } from 'react'
import { z } from 'zod'
import s from './newPassword.module.scss'
import { useTranslations } from 'next-intl'
import { NewPasswordRequest } from '@/features/auth/api/authApi.types'
import { createPasswordSchema } from '@/features/auth/utils/schemas/PasswordSchema'
import { useSearchParams } from 'next/navigation'

type Props = {
  className?: string
  isLoading: boolean
  onSubmitAction: (data: NewPasswordRequest) => void
}

export const NewPassword = ({ className, isLoading, onSubmitAction }: Props) => {
  const searchParams = useSearchParams()
  const recoveryCode = searchParams.get('code') || ''

  const t = useTranslations('auth.newPassword')
  const tv = useTranslations('auth.validation')

  const makeNewPasswordSchema = (tv: ReturnType<typeof useTranslations>) =>
    z
      .object({
        password: createPasswordSchema({
          required: tv('required'),
          minLength: tv('password.minLength'),
          maxLength: tv('password.maxLength'),
          uppercase: tv('password.uppercase'),
          number: tv('password.number'),
          specialChar: tv('password.specialChar'),
        }),
        confirmPassword: z.string({ required_error: tv('required') }),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: tv('passwordsDoNotMatch'),
        path: ['confirmPassword'],
      })

  const newPasswordSchema = useMemo(() => makeNewPasswordSchema(tv), [tv])

  const additionalContent = (
    <div className={s.content}>
      <Typography variant="body2">{t('description')}</Typography>
    </div>
  )

  const fields = [
    { name: 'password' as const, label: t('fields.newPassword'), type: 'password' },
    { name: 'confirmPassword' as const, label: t('fields.passwordConfirmation'), type: 'password' },
  ]

  const handleSubmit = (data: z.infer<ReturnType<typeof makeNewPasswordSchema>>) => {
    const submitData: NewPasswordRequest = {
      recoveryCode,
      newPassword: data.password,
    }
    onSubmitAction(submitData)
  }

  return (
    <Card className={clsx(s.card, className)}>
      <Typography variant="h1">{t('title')}</Typography>
      <Form
        btnText={t('button')}
        fields={fields}
        schema={newPasswordSchema}
        onSubmit={handleSubmit}
        disabled={isLoading}
        additionalContent={additionalContent}
      />
    </Card>
  )
}
