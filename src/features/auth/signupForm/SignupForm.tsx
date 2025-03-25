'use client'
import { ReactNode } from 'react'
import Link from 'next/link'
import { Path, SubmitHandler } from 'react-hook-form'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { z } from 'zod'

import { Card, Form, Typography } from '@/shared/ui'
import { SignupSchema } from '../utils/schemas/SignupSchema'
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
  const handleSignupSubmit: SubmitHandler<z.infer<typeof SignupSchema>> = (
    data
  ) => {
    console.log('Form submitted with:', data)
  }

  return (
    <Card className={s.card}>
      <Typography as="h1" variant="h1" className={s.title}>
        Sign Up
      </Typography>

      <div className={s.iconsContainer}>
        <FcGoogle className={s.icon} />
        <FaGithub className={s.icon} />
      </div>

      <Form
        btnText="Sign Up"
        fields={fields}
        schema={SignupSchema}
        onSubmit={handleSignupSubmit}
      />
      <div className={s.footer}>
        <Typography>Do you have an account?</Typography>
        <Link href="signin" className={s.link}>
          Sign In
        </Link>
      </div>
    </Card>
  )
}
