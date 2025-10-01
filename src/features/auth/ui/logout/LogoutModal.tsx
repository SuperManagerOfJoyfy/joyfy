'use client'

import { PATH } from '@/shared/config/routes'
import { toast } from 'react-toastify'
import { useLogoutMutation } from '@/features/auth/api/authApi'
import { ConfirmModal } from '@/shared/ui/confirmModal/ConfirmModal'
import { closeSocket } from '@/shared/config/socket'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

type Props = {
  email?: string
  open: boolean
  onOpenLogoutModalHandler: (value: boolean) => void
}

export const LogoutModal = ({ open, onOpenLogoutModalHandler, email }: Props) => {
  const t = useTranslations('logoutModal')
  const tMessages = useTranslations('messages.auth')

  const router = useRouter()
  const [logout] = useLogoutMutation()

  const onLogoutButtonClickHandler = async () => {
    try {
      await logout().unwrap()
      closeSocket() // close ws socket connection on logout
      router.push(PATH.AUTH.LOGIN)
      toast.success(tMessages('logoutSuccess'))
    } catch (error: any) {
      toast.error(tMessages('logoutError'))
    } finally {
      onOpenLogoutModalHandler(false)
    }
  }

  return (
    <ConfirmModal
      title={t('title')}
      description={t('description', { email: email ? ` ${email}` : '' })}
      isOpen={open}
      setIsOpen={onOpenLogoutModalHandler}
      onConfirm={onLogoutButtonClickHandler}
    />
  )
}
