import { ReactNode } from 'react'
import { Path } from 'react-hook-form'
import type { SignupSchema as SignupSchemaType } from '../../utils/schemas/SignupSchema'
import { Link } from '@/i18n/navigation'
import { PATH } from '@/shared/config/routes'
import s from './signupForm.module.scss'
import { useTranslations } from 'next-intl'

export const useSignupFields = (disableAll: boolean) => {
  const t = useTranslations('auth.signup.fields')

  const fields: {
    name: Path<SignupSchemaType>
    label: ReactNode
    type?: string
  }[] = [
    { name: 'userName', label: t('username') },
    { name: 'email', label: t('email'), type: 'email' },
    { name: 'password', label: t('password'), type: 'password' },
    { name: 'passwordConfirmation', label: t('passwordConfirmation'), type: 'password' },
    {
      name: 'agreeToTerms',
      label: (
        <span className={s.label}>
          {t('agreePrefix')}{' '}
          <Link href={PATH.AUTH.TERMS_OF_SERVICE} target="_blank" className={disableAll ? s.disabledLink : ''}>
            {t('terms')}
          </Link>{' '}
          {t('and')}{' '}
          <Link href={PATH.AUTH.PRIVACY_POLICY} target="_blank" className={disableAll ? s.disabledLink : ''}>
            {t('privacy')}
          </Link>
        </span>
      ),
      type: 'checkbox',
    },
  ]

  return fields
}
