'use client'

import { EmailVerification } from '@/features/auth/ui/emailVerification'
import expiredImg from '@/features/auth/assets/images/EmailVerification/expired.png'
import { Form } from '@/shared/ui'
import { z } from 'zod'
import { createEmailSchema } from '@/features/auth/utils/schemas/EmailSchema'
import { useState, useMemo } from 'react'
import { useResendEmailConfirmationMutation } from '@/features/auth/api/authApi'
import { SentEmailModal } from '@/features/auth/ui'
import { useTranslations } from 'next-intl'
import s from './EmailConfirmation.module.scss'

export const LinkExpired = () => {
  const t = useTranslations('auth.linkExpired')
  const tv = useTranslations('auth.validation')

  const EmailFormSchema = useMemo(
    () =>
      z.object({
        email: createEmailSchema({
          required: tv('required'),
          email: tv('email'),
        }),
      }),
    [tv]
  )

  const [modalOpen, setModalOpen] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [resendEmail] = useResendEmailConfirmationMutation()

  const handleSendEmailSubmit = async ({ email }: z.infer<typeof EmailFormSchema>) => {
    try {
      await resendEmail({ email, baseUrl: 'https://joyfy.online' }).unwrap()
      setModalOpen(true)
      setRegisteredEmail(email)
    } catch (error) {}
  }

  return (
    <>
      <EmailVerification title={t('title')} description={t('description')} imageSrc={expiredImg}>
        <div className={s.expiredForm}>
          <Form
            btnText={t('button')}
            fields={[{ name: 'email', label: t('emailLabel') }]}
            schema={EmailFormSchema}
            onSubmit={handleSendEmailSubmit}
          />
        </div>
      </EmailVerification>
      <SentEmailModal open={modalOpen} email={registeredEmail} />
    </>
  )
}
