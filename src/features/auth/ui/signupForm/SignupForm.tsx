'use client'

import { useState, useMemo } from 'react'
import { z } from 'zod'
import { useRegisterMutation } from '@/features/auth/api/authApi'
import { createSignupSchema } from '@/features/auth/utils/schemas/SignupSchema'
import { RegisterRequest } from '@/features/auth/api/authApi.types'
import { PATH } from '@/shared/config/routes'
import { Card, Form, Typography } from '@/shared/ui'
import { SocialLinks } from '../socialLinks'
import { useSignupFields } from './useSignupFormFields'
import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'

import s from './signupForm.module.scss'

type Props = {
  onSubmitSuccess?: (email: string) => void
}

export const SignupForm = ({ onSubmitSuccess }: Props) => {
  const t = useTranslations('auth.signup')
  const tv = useTranslations('auth.validation')

  const [isSocialLoading, setIsSocialLoading] = useState(false)
  const [signup, { isLoading }] = useRegisterMutation()

  const locale = useLocale()

  const disableAll = isSocialLoading || isLoading

  const signupSchema = useMemo(() => {
    const schema = createSignupSchema({
      required: tv('required'),
      email: tv('email'),
      password: {
        minLength: tv('password.minLength'),
        maxLength: tv('password.maxLength'),
        uppercase: tv('password.uppercase'),
        number: tv('password.number'),
        specialChar: tv('password.specialChar'),
      },
      userName: {
        min: tv('userName.min'),
        max: tv('userName.max'),
        invalid: tv('userName.invalid'),
      },
      agreeToTerms: tv('agreeToTerms'),
      passwordsDoNotMatch: tv('passwordsDoNotMatch'),
    })

    return schema
  }, [tv])

  const fields = useSignupFields(disableAll)

  const handleSignupSubmit = async (data: z.infer<typeof signupSchema>) => {
    const registerData: RegisterRequest = {
      ...data,
      baseUrl: `${window.location.origin}/${locale}`,
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
        btnText={t('button')}
        fields={fields}
        schema={signupSchema}
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
