'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import { toast } from 'react-toastify'
import { z } from 'zod'

import { Form, Typography } from '@/shared/ui'
import { Card } from '@/shared/ui/card'
import { SocialLinks } from '@/features/auth/ui/socialLinks'
import { useLoginMutation } from '@/features/auth/api/authApi'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { EmailSchema } from '@/features/auth/utils/schemas/EmailSchema'

import s from './login.module.scss'

type Props = {
  className?: string
}

const loginSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, 'Required'),
})

export const Login = ({ className }: Props) => {
  const [isSocialLoading, setIsSocialLoading] = useState(false)
  const [login, { isLoading }] = useLoginMutation()
  const { refetch } = useAuth()
  const router = useRouter()

  const disableAll = isSocialLoading || isLoading

  const fields = [
    { name: 'email' as const, label: 'Email', type: 'email' },
    { name: 'password' as const, label: 'Password', type: 'password' },
  ]

  const handleSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const { message } = await login(data).unwrap()

      toast.success(message || 'Successfully logged in!')

      await new Promise((r) => setTimeout(r, 200))

      try {
        await refetch().unwrap()
      } catch {
        toast.warn('Logged in, but failed to fetch user info.')
      }

      router.push('/')
    } catch (err: any) {
      console.error('Login failed:', err)

      const errorMessage =
        err?.data?.message ||
        err?.message ||
        'Login failed. Please check your credentials.'

      toast.error(errorMessage)
    }
  }

  const additionalContent = (
    <div className={s.content}>
      <Link href="/auth/recovery" className={s.forgot}>
        Forgot Password
      </Link>
    </div>
  )

  return (
    <Card className={clsx(s.card, className)}>
      <Typography variant="h1">Sign In</Typography>

      <div className={s.socialLinksWrap}>
        <SocialLinks
          isDisabled={disableAll}
          onStartLoading={() => setIsSocialLoading(true)}
        />
      </div>

      <Form
        btnText="Sign In"
        fields={fields}
        schema={loginSchema}
        onSubmit={handleSubmit}
        additionalContent={additionalContent}
        disabled={disableAll}
      />

      <Typography variant="body1" className={s.account}>
        Don't have an account?
      </Typography>

      <Link href="/auth/registration" className={s.signUp}>
        Sign Up
      </Link>
    </Card>
  )
}
