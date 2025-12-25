'use client'

import { useTranslations } from 'next-intl'
import { useNewPasswordMutation } from '@/features/auth/api/authApi'
import { NewPassword } from '@/features/auth/ui/newPassword'
import { NewPasswordRequest } from '@/features/auth/api/authApi.types'
import { toast } from 'react-toastify'
import { useRouter } from '@/i18n/navigation'
import { PATH } from '@/shared/config/routes'

const Page = () => {
  const [newPassword, { isLoading }] = useNewPasswordMutation()
  const tMessages = useTranslations('messages.auth')

  const router = useRouter()

  const handleRecoverPassword = async (data: NewPasswordRequest) => {
    try {
      await newPassword(data).unwrap()
      toast.success(tMessages('resetPasswordSuccess'))
      router.push(`/${PATH.AUTH.LOGIN}`)
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
