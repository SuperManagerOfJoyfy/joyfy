'use client'

import { useTranslations } from 'next-intl'
import { useNewPasswordMutation } from '@/features/auth/api/authApi'
import { NewPassword } from '@/features/auth/ui/newPassword'
import { NewPasswordRequest } from '@/features/auth/api/authApi.types'

const Page = () => {
  const [newPassword, { isLoading }] = useNewPasswordMutation()
  const t = useTranslations('verifyEmail')

  const handleRecoverPassword = async (data: NewPasswordRequest) => {
    try {
      await newPassword(data).unwrap()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <NewPassword isLoading={isLoading} onSubmitAction={handleRecoverPassword} />
    </div>
  )
}

export default Page
