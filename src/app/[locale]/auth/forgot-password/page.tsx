'use client'

import { useTranslations } from 'next-intl'
import { ForgotPassword, ForgotPasswordFormValues } from '@/features/auth/ui/forgotPassword/ForgotPassword'
import { useRecoverPasswordMutation } from '@/features/auth/api/authApi'
import { RecoverPasswordRequest } from '@/features/auth/api/authApi.types'
import { useState } from 'react'
import { SentEmailModal } from '@/features/auth/ui'

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [recoverPassword, { isLoading }] = useRecoverPasswordMutation()
  const t = useTranslations('verifyEmail')

  const onOpenChangeHandler = (value: boolean) => {
    setIsModalOpen(value)
  }
  const handleRecoverPassword = async (data: ForgotPasswordFormValues) => {
    const finalData: RecoverPasswordRequest = {
      ...data,
      baseUrl: window.location.origin,
    }

    try {
      await recoverPassword(finalData).unwrap()
      setEmail(data.email)
      setIsModalOpen(true)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="container">
      <ForgotPassword
        isLoading={isLoading}
        onSubmitAction={handleRecoverPassword}
        siteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      />
      <SentEmailModal open={isModalOpen} onOpenChange={onOpenChangeHandler} email={email} />
    </div>
  )
}

export default Page
