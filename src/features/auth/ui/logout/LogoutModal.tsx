'use client'

import { PATH } from '@/shared/config/routes'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useLogoutMutation } from '@/features/auth/api/authApi'
import { MESSAGES } from '@/shared/config/messages'
import { ConfirmModal } from '@/shared/ui/confirmModal/ConfirmModal'
import { closeSocket } from '@/shared/config/socket'

type Props = {
  email?: string
  open: boolean
  onOpenLogoutModalHandler: (value: boolean) => void
}
export const LogoutModal = ({ open, onOpenLogoutModalHandler, email }: Props) => {
  const router = useRouter()
  const [logout] = useLogoutMutation()

  const onLogoutButtonClickHandler = async () => {
    try {
      await logout().unwrap()
      closeSocket() // close ws socket connection on logout
      router.push(PATH.AUTH.LOGIN)
      toast.success(MESSAGES.AUTH.LOGOUT_SUCCESS)
    } catch (error: any) {
      toast.error(MESSAGES.AUTH.LOGOUT_ERROR)
    } finally {
      onOpenLogoutModalHandler(false)
    }
  }

  return (
    <ConfirmModal
      title={'Log Out'}
      description={`Do you really want to log out of your account? ${email}`}
      isOpen={open}
      setIsOpen={onOpenLogoutModalHandler}
      onConfirm={onLogoutButtonClickHandler}
    />
  )
}
