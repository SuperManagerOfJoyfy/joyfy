import { Form, Typography } from '@/shared/ui'
import { Card } from '@/shared/ui/card'
import s from './login.module.scss'
import clsx from 'clsx'
import { SocialLinks } from '@/features/auth/ui/socialLinks'
import { z } from 'zod'

type Props = {
  className?: string
}

const signInSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Invalid password'),
})

export const Login = ({ className }: Props) => {
  const fields: any = [
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'password', label: 'Password', type: 'password' },
  ]

  const additionalContent = (
    <div className={s.content}>
      <Typography as="a" href="test" variant="body2" className={s.forgot}>
        Forgot Password
      </Typography>
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
        schema={signInSchema}
        onSubmit={console.log}
        additionalContent={additionalContent}
      />

      <Typography variant="body1" className={s.account}>
        Don't have an account?
      </Typography>

      <Typography as="a" href="test2" variant="link1" className={s.signUp}>
        Sign Up
      </Typography>
    </Card>
  )
}
