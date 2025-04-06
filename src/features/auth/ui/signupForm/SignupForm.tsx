'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { Path, SubmitHandler } from 'react-hook-form'
import { z } from 'zod'

import { Card, Form, Typography } from '@/shared/ui'
import { SocialLinks } from '../socialLinks'
import { SignupSchema } from '@/features/auth/utils/schemas/SignupSchema'
import s from './signupForm.module.scss'

const fields: {
  name: Path<z.infer<typeof SignupSchema>>
  label: ReactNode
  type?: string
}[] = [
  { name: 'username', label: 'Username' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
  { name: 'confirmPassword', label: 'Password confirmation', type: 'password' },
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

export const SignupForm = () => {
  const [isSocialLoading, setIsSocialLoading] = useState(false)

  const handleSignupSubmit: SubmitHandler<z.infer<typeof SignupSchema>> = (
    data
  ) => {
    console.log('Form submitted with:', data)
  }

  const disableAll = isSocialLoading

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
