'use client'
import { ReactNode, useState } from 'react'
import { z } from 'zod'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { Path } from 'react-hook-form'
import { Card, Form, Typography } from '@/shared/ui'
import { SocialLinks } from '../socialLinks'
import { SignupSchema } from '@/features/auth/utils/schemas/SignupSchema'
import { useRegisterMutation } from '@/features/auth/api/authApi'
import s from './signupForm.module.scss'

const fields: {
  name: Path<z.infer<typeof SignupSchema>>
  label: ReactNode
  type?: string
}[] = [
  { name: 'username', label: 'Username' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
  { name: 'passwordConfirmation', label: 'Confirm password', type: 'password' },
  {
    name: 'agreeToTerms',
    label: (
      <span className={s.label}>
        I agree to the <Link href="/auth/terms-of-service">Terms of Service</Link>{' '}
        and <Link href="/auth/privacy-policy">Privacy Policy</Link>
      </span>
    ),
    type: 'checkbox',
  },
]

type Props = {
  onSubmitSuccess?: (email: string) => void
}

export const SignupForm = ({ onSubmitSuccess }: Props) => {
  const [isSocialLoading, setIsSocialLoading] = useState(false)
  const [signup, { isLoading }] = useRegisterMutation()

  const handleSignupSubmit = async (data: z.infer<typeof SignupSchema>) => {
    try {
      const result = await signup(data).unwrap()
      onSubmitSuccess?.(data.email)
      return result
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.error || 'Registration failed. Try again.'
      toast.error(errorMsg)
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
          <Link href="/auth/login" className={s.link}>
            Sign In
          </Link>
        )}
      </div>
    </Card>
  )
}
