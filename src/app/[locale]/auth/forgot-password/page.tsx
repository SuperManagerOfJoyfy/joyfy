'use client'

import { useLocale } from 'next-intl'
import { ForgotPassword, ForgotPasswordFormValues } from '@/features/auth/ui/forgotPassword/ForgotPassword'
import { useRecoverPasswordMutation } from '@/features/auth/api/authApi'
import { RecoverPasswordRequest } from '@/features/auth/api/authApi.types'
import { useState } from 'react'
import { SentEmailModal } from '@/features/auth/ui'

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [recoverPassword, { isLoading }] = useRecoverPasswordMutation()
  const locale = useLocale()

  const [serverError, setServerError] = useState('')
  const [successDescription, setSuccessDescription] = useState(false)

  const onOpenChangeHandler = (value: boolean) => {
    setIsModalOpen(value)
  }
  const handleRecoverPassword = async (data: ForgotPasswordFormValues) => {
    const baseUrl = `${window.location.origin}/${locale}`
    const finalData: RecoverPasswordRequest = {
      ...data,
      baseUrl,
    }

    try {
      await recoverPassword(finalData).unwrap()
      setEmail(data.email)
      setIsModalOpen(true)
      setSuccessDescription(true)
    } catch (error: any) {
      setServerError(error.data?.messages[0].message || 'Something went wrong')
    }
  }

  return (
    <div>
      <ForgotPassword
        isLoading={isLoading}
        onSubmitAction={handleRecoverPassword}
        siteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
        serverError={serverError}
        successDescription={successDescription}
      />
      <SentEmailModal open={isModalOpen} onOpenChange={onOpenChangeHandler} email={email} />
    </div>
  )
}

export default Page
