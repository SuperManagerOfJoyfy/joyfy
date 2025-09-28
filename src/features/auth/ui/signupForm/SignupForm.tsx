'use client'
import { useState } from 'react'
import { z } from 'zod'
import { useRegisterMutation } from '@/features/auth/api/authApi'
import { SignupSchema } from '@/features/auth/utils/schemas/SignupSchema'
import { RegisterRequest } from '@/features/auth/api/authApi.types'
import { PATH } from '@/shared/config/routes'
import { Card, Form, Typography } from '@/shared/ui'
import { SocialLinks } from '../socialLinks'
import { useSignupFields } from './useSignupFormFields'
import s from './signupForm.module.scss'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

type Props = {
  onSubmitSuccess?: (email: string) => void
}

export const SignupForm = ({ onSubmitSuccess }: Props) => {
  const t = useTranslations('auth.signup')

  const [isSocialLoading, setIsSocialLoading] = useState(false)
  const [signup, { isLoading }] = useRegisterMutation()
  const disableAll = isSocialLoading || isLoading

  const fields = useSignupFields(disableAll)

  const handleSignupSubmit = async (data: z.infer<typeof SignupSchema>) => {
    const registerData: RegisterRequest = {
      ...data,
      baseUrl: window.location.origin,
    }
    try {
      await signup(registerData).unwrap()
      onSubmitSuccess?.(data.email)
    } catch (err) {
      throw err
    }
  }

  return (
    <Card className={s.card}>
      <Typography as="h1" variant="h1" className={s.title}>
        {t('title')}
      </Typography>

      <SocialLinks isDisabled={disableAll} onStartLoading={() => setIsSocialLoading(true)} />

      <Form
        btnText={t('title')}
        fields={fields}
        schema={SignupSchema}
        onSubmit={handleSignupSubmit}
        disabled={disableAll}
      />

      <div className={s.footer}>
        <Typography>{t('footerQuestion')}</Typography>
        {disableAll ? (
          <span className={`${s.link} ${s.disabledLink}`} aria-disabled="true">
            {t('footerLink')}
          </span>
        ) : (
          <Link href={PATH.AUTH.LOGIN} className={s.link}>
            {t('footerLink')}
          </Link>
        )}
      </div>
    </Card>
  )
}
