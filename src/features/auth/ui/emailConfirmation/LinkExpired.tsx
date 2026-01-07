'use client'

import { EmailVerification } from '@/features/auth/ui/emailVerification'
import expiredImg from '@/features/auth/assets/images/EmailVerification/expired.png'
import { Form } from '@/shared/ui'
import { z } from 'zod'
import { createEmailSchema } from '@/features/auth/utils/schemas/EmailSchema'
import { useMemo, useState } from 'react'
import { usePasswordRecoveryResendingMutation, useResendEmailConfirmationMutation } from '@/features/auth/api/authApi'
import { SentEmailModal } from '@/features/auth/ui'
import { useTranslations } from 'next-intl'
import s from './EmailConfirmation.module.scss'
import { ReasonType } from '@/features/auth/ui/authActionHandler/AuthActionHandler'

export const LinkExpired = ({ reason, locale }: { reason: ReasonType; locale: string }) => {
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
  const [targetEmail, setTargetEmail] = useState('')

  // Две разные мутации
  const [resendConfirmation] = useResendEmailConfirmationMutation()
  const [resendRecovery] = usePasswordRecoveryResendingMutation()

  const handleSendEmailSubmit = async ({ email }: z.infer<typeof EmailFormSchema>) => {
    try {
      const baseUrl = `${window.location.origin}/${locale}`

      if (reason === 'RECOVERY') {
        debugger
        await resendRecovery({ email, baseUrl }).unwrap()
      } else {
        await resendConfirmation({ email, baseUrl }).unwrap()
      }

      setTargetEmail(email)
      setModalOpen(true)
    } catch (error) {
      console.error('Failed to resend link:', error)
    }
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
      <SentEmailModal open={modalOpen} onOpenChange={setModalOpen} email={targetEmail} />
    </>
  )
}
