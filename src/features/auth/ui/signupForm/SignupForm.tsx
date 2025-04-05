'use client'
import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { Path } from 'react-hook-form'
import { z } from 'zod'
import { Card, Form, Typography } from '@/shared/ui'
import { SocialLinks } from '../socialLinks'
import { SignupSchema } from '@/features/auth/utils/schemas/SignupSchema'
import s from './signupForm.module.scss'
import { useRegisterMutation } from '@/features/auth/api/authApi'

const fields: {
  name: Path<z.infer<typeof SignupSchema>>
  label: ReactNode
  type?: string
}[] = [
  { name: 'username', label: 'Username' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
  { name: 'confirmPassword', label: 'Confirm password', type: 'password' },
  {
    name: 'agreeToTerms',
    label: (
      <span className={s.label}>
        I agree to the <Link href="/terms-of-service">Terms of Service</Link>{' '}
        and <Link href="/privacy-policy">Privacy Policy</Link>
      </span>
    ),
    type: 'checkbox',
  },
]

type Props = {
  onSubmitSuccess?: () => void
}

export const SignupForm = ({ onSubmitSuccess }: Props) => {
  const [isSocialLoading, setIsSocialLoading] = useState(false)
  const [signup, { isLoading, error }] = useRegisterMutation()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!error) return

    let errMsg: string

    if ('status' in error) {
      if (typeof error.status === 'number' && error.data) {
        errMsg =
          (error.data as { message?: string }).message || 'Ошибка сервера'
      } else if ('error' in error) {
        errMsg = error.error
      } else {
        errMsg = 'Неизвестная ошибка'
      }
    } else {
      errMsg = error.message || 'Произошла ошибка'
    }
    setErrorMsg(errMsg)
    console.error('Ошибка:', errMsg)
  }, [error])

  const handleSignupSubmit = async (data: z.infer<typeof SignupSchema>) => {
    try {
      const result = await signup(data).unwrap()
      onSubmitSuccess?.()
      return result
    } catch (err: any) {
      console.error('Ошибка регистрации:', err.data?.message)
      throw err
    }
  }

  const disableAll = isSocialLoading || isLoading

  return (
    <Card className={s.card}>
      <Typography as="h1" variant="h1" className={s.title}>
        Sign Up
      </Typography>

      <SocialLinks
        isDisabled={disableAll}
        onStartLoading={() => setIsSocialLoading(true)}
      />
      {errorMsg && <div className={s.error}>{errorMsg}</div>}
      <Form
        btnText="Sign Up"
        fields={fields}
        schema={SignupSchema}
        onSubmit={handleSignupSubmit}
        disabled={disableAll}
      />

      <div className={s.footer}>
        <Typography>Do you have an account?</Typography>
        <Link href="/auth/login" className={s.link}>
          Sign In
        </Link>
      </div>
    </Card>
  )
}
