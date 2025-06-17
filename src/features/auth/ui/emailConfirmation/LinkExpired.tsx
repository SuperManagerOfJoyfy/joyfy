'use client'

import { EmailVerification } from '@/features/auth/ui/emailVerification'
import expiredImg from '@/features/auth/assets/images/EmailVerification/expired.png'
import { Form } from '@/shared/ui'
import { z } from 'zod'
import { EmailFormSchema } from '@/features/auth/utils/schemas/EmailSchema'
import { useState } from 'react'
import { useResendEmailConfirmationMutation } from '@/features/auth/api/authApi'
import { SentEmailModal } from '@/features/auth/ui'
import s from './EmailConfirmation.module.scss'

export const LinkExpired = () => {
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
      <EmailVerification
        title="Email verification link expired"
        description="Looks like the verification link has expired. Not to worry, we can send the link again"
        imageSrc={expiredImg}
      >
        <div className={s.expiredForm}>
          <Form
            btnText="Resend verification link"
            fields={[{ name: 'email', label: 'Email' }]}
            schema={EmailFormSchema}
            onSubmit={handleSendEmailSubmit}
          />
        </div>
      </EmailVerification>
      <SentEmailModal open={modalOpen} email={registeredEmail} />
    </>
  )
}
