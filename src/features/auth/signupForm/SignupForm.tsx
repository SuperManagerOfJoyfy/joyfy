'use client'
import { Path, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import Link from 'next/link'
import { z } from 'zod'

import {
  Card,
  Checkbox,
  ControlledCheckbox,
  Form,
  Typography,
} from '@/shared/ui'
import { SignupSchema } from '../utils/schemas/SignupSchema'
import s from './signupForm.module.scss'

const fields: {
  name: Path<z.infer<typeof SignupSchema>>
  label: string
  type?: string
}[] = [
  { name: 'username', label: 'Username' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'password', label: 'Password', type: 'password' },
  { name: 'confirmPassword', label: 'Password confirmation', type: 'password' },
]

export const SignupForm = () => {
  const { control, handleSubmit } = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: { agreeToTerms: false },
  })

  const handleSignupSubmit: SubmitHandler<z.infer<typeof SignupSchema>> = (
    data
  ) => {
    console.log('Form submitted with:', data)
  }

  const additionalContent = (
    <div className={s.contentContainer}>
      <ControlledCheckbox
        control={control}
        name="agreeToTerms"
        labelClassName={s.checkboxLabel}
        label="I agree to the Terms of Service and Privacy Policy"
      />
    </div>
  )

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
        additionalContent={additionalContent}
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
