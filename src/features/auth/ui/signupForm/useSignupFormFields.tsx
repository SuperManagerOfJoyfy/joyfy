import { ReactNode } from 'react'
import { Path } from 'react-hook-form'
import { SignupSchema } from '../../utils/schemas/SignupSchema'
import { z } from 'zod'
import Link from 'next/link'
import { PATH } from '@/shared/config/routes'
import s from './signupForm.module.scss'

export const useSignupFields = (disableAll: boolean) => {
  const fields: {
    name: Path<z.infer<typeof SignupSchema>>
    label: ReactNode
    type?: string
  }[] = [
    { name: 'userName', label: 'Username' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'password', label: 'Password', type: 'password' },
    {
      name: 'passwordConfirmation',
      label: 'Confirm password',
      type: 'password',
    },
    {
      name: 'agreeToTerms',
      label: (
        <span className={s.label}>
          I agree to the{' '}
          <Link href={PATH.AUTH.TERMS_OF_SERVICE} target="_blank" className={disableAll ? s.disabledLink : ''}>
            Terms of Service{' '}
          </Link>
          and{' '}
          <Link href={PATH.AUTH.PRIVACY_POLICY} target="_blank" className={disableAll ? s.disabledLink : ''}>
            Privacy Policy
          </Link>
        </span>
      ),
      type: 'checkbox',
    },
  ]
  return fields
}
