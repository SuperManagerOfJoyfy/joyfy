'use client'

import React from 'react'
import { Button, Modal, Typography } from '@/shared/ui'
import s from './logoutModal.module.scss'
import { PATH } from '@/shared/config/routes'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { useLogoutMutation } from '@/features/auth/api/authApi'
import { AUTH_MESSAGES } from '@/shared/config/messages'

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
      router.push(PATH.AUTH.LOGIN)
      toast.success(AUTH_MESSAGES.LOGOUT_SUCCESS)
    } catch (error: any) {
      toast.error(AUTH_MESSAGES.LOGOUT_ERROR)
    } finally {
      onOpenLogoutModalHandler(false)
    }
  }

  return (
    <Modal open={open} title="Log Out" onOpenChange={() => onOpenLogoutModalHandler(false)}>
      <div className={s.modal}>
        <Typography variant="body1" className={s.typography}>
          Do you really want to log out of your account?
          {email}
        </Typography>
        <div className={s.buttons}>
          <Button variant="secondary" className={s.button} onClick={onLogoutButtonClickHandler}>
            Yes
          </Button>
          <Button
            className={s.button}
            onClick={() => {
              onOpenLogoutModalHandler(false)
            }}
          >
            No
          </Button>
        </div>
      </div>
    </Modal>
  )
}
