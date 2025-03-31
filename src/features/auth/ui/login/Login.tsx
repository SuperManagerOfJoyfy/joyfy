import { Form, Typography } from '@/shared/ui'
import { Card } from '@/shared/ui/card'
import s from './login.module.scss'
import clsx from 'clsx'
import { SocialLinks } from '@/features/auth/ui/socialLinks'
import { z } from 'zod'
import { EmailSchema } from '@/features/auth/utils/schemas/EmailSchema'
import Link from 'next/link'

type Props = {
  className?: string
}

const loginSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, 'Required'),
})

export const Login = ({ className }: Props) => {
  const fields = [
    { name: 'email' as const, label: 'Email', type: 'email' },
    { name: 'password' as const, label: 'Password', type: 'password' },
  ]

  const additionalContent = (
    <div className={s.content}>
      <Link href="test" className={s.forgot}>
        Forgot Password
      </Link>
    </div>
  )

  return (
    <Card className={clsx(s.card, className)}>
      <Typography variant="h1">Sign In</Typography>

      <div className={s.socialLinksWrap}>
        <SocialLinks />
      </div>

      <Form
        btnText="Sign In"
        fields={fields}
        schema={loginSchema}
        onSubmit={console.log}
        additionalContent={additionalContent}
      />

      <Typography variant="body1" className={s.account}>
        Don't have an account?
      </Typography>

      <Link href="test2" className={s.signUp}>
        Sign Up
      </Link>
    </Card>
  )
}
