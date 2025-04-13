import { Form, Typography } from '@/shared/ui'
import { Card } from '@/shared/ui/card'
import clsx from 'clsx'
import { SocialLinks } from '@/features/auth/ui/socialLinks'
import { z } from 'zod'
import { EmailSchema } from '@/features/auth/utils/schemas/EmailSchema'
import Link from 'next/link'
import { useState } from 'react'
import s from './login.module.scss'
import { PATH } from '@/shared/config/routes'

const loginSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, 'Required'),
})

type Props = {
  className?: string
  isLoading: boolean
  onSubmit: (data: LoginFormValues) => void
}

export type LoginFormValues = z.infer<typeof loginSchema>

export const Login = ({ className, isLoading, onSubmit }: Props) => {
  const [isSocialLoading, setIsSocialLoading] = useState(false)

  const fields = [
    { name: 'email' as const, label: 'Email', type: 'email' },
    { name: 'password' as const, label: 'Password', type: 'password' },
  ]

  const additionalContent = (
    <div className={s.content}>
      <Link href="forgot password" className={s.forgot}>
        Forgot Password
      </Link>
    </div>
  )

  return (
    <Card className={clsx(s.card, className)}>
      <Typography variant="h1">Sign In</Typography>

      <div className={s.socialLinksWrap}>
        <SocialLinks
          isDisabled={isSocialLoading || isLoading}
          onStartLoading={() => setIsSocialLoading(true)}
        />
      </div>

      <Form
        btnText="Sign In"
        fields={fields}
        schema={loginSchema}
        onSubmit={onSubmit}
        additionalContent={additionalContent}
        disabled={isSocialLoading || isLoading}
      />

      <Typography variant="body1" dis className={s.account}>
        Don't have an account?
      </Typography>

      <Link href={PATH.AUTH.REGISTRATION} className={s.signUp}>
        Sign Up
      </Link>
    </Card>
  )
}
