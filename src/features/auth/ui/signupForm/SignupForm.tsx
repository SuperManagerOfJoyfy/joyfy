'use client'
import { useState } from 'react'
import Link from 'next/link'
import { z } from 'zod'
import { useRegisterMutation } from '@/features/auth/api/authApi'
import { SignupSchema } from '@/features/auth/utils/schemas/SignupSchema'
import { PATH } from '@/shared/config/routes'
import { Card, Form, Typography } from '@/shared/ui'
import { SocialLinks } from '../socialLinks'
import { useSignupFields } from './useSignupFormFields'
import s from './signupForm.module.scss'

type Props = {
  onSubmitSuccess?: (email: string) => void
}

export const SignupForm = ({ onSubmitSuccess }: Props) => {
  const [isSocialLoading, setIsSocialLoading] = useState(false)
  const [signup, { isLoading }] = useRegisterMutation()
  const disableAll = isSocialLoading || isLoading

  const fields = useSignupFields(disableAll)

  const handleSignupSubmit = async (data: z.infer<typeof SignupSchema>) => {
    try {
      await signup(data).unwrap()
      onSubmitSuccess?.(data.email)
    } catch (err) {
      throw err
    }
  }

  return (
    <Card className={s.card}>
      <Typography as="h1" variant="h1" className={s.title}>
        Sign Up
      </Typography>

      <SocialLinks
        isDisabled={disableAll}
        onStartLoading={() => setIsSocialLoading(true)}
      />

      <Form
        btnText="Sign Up"
        fields={fields}
        schema={SignupSchema}
        onSubmit={handleSignupSubmit}
        disabled={disableAll}
      />

      <div className={s.footer}>
        <Typography>Do you have an account?</Typography>
        {disableAll ? (
          <span className={`${s.link} ${s.disabledLink}`} aria-disabled="true">
            Sign In
          </span>
        ) : (
          <Link href={PATH.AUTH.LOGIN} className={s.link}>
            Sign In
          </Link>
        )}
      </div>
    </Card>
  )
}
