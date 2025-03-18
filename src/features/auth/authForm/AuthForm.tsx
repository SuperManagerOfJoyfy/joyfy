'use client'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { useForm, FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodType } from 'zod'

import { Button, Typography } from '@/shared/ui'
import { Card } from '@/shared/ui/card'
import s from './authForm.module.scss'
import { ReactNode } from 'react'
import Link from 'next/link'

type Props<T extends FieldValues> = {
  title: string
  type: 'signup' | 'signin'
  children: ReactNode
  schema: ZodType<T>
  onSubmit: (data: T) => void
}

export const AuthForm = <T extends FieldValues>({
  title,
  type,
  onSubmit,
  schema,
  children,
}: Props<T>) => {
  const formMethods = useForm<T>({ resolver: zodResolver(schema) })
  return (
    <Card className={s.card}>
      <Typography as="h1" variant="h1" className={s.title}>
        {title}
      </Typography>

      <div className={s.iconsContainer}>
        <FcGoogle className={s.icon} />
        <FaGithub className={s.icon} />
      </div>

      <form onSubmit={formMethods.handleSubmit(onSubmit)} className={s.form}>
        <div className={s.inputsContainer}>{children}</div>
        <Button type="submit" fullWidth>
          {type === 'signup' ? 'Sign Up' : 'Sign In'}
        </Button>
      </form>
      <div className={s.footer}>
        {type === 'signup' ? (
          <>
            <Typography>Do you have an account?</Typography>
            <Link href="signin" className={s.link}>
              {' '}
              Sign In
            </Link>
          </>
        ) : (
          <>
            <Typography>Don&apos;t have an account?</Typography>
            <Link href="signup" className={s.link}>
              {' '}
              Sign Up
            </Link>
          </>
        )}
      </div>
    </Card>
  )
}
