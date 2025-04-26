'use client'

import React from 'react'
import { Button, Modal, Typography } from '@/shared/ui'
import s from './logoutModal.module.scss'
import { PATH } from '@/shared/config/routes'
import { useRouter } from 'next/navigation'

type Props = {
  email?: string
  open: boolean
  onOpenLogoutModalHandler: (value: boolean) => void
  onLogout: () => Promise<'success' | 'unauthorized' | 'error'>
}
export const LogoutModal = ({ onLogout, open, onOpenLogoutModalHandler, email }: Props) => {
  const router = useRouter()

  const onLogoutButtonClickHandler = async () => {
    const result = await onLogout()
    if (result === 'success') {
      router.push(PATH.AUTH.LOGIN)
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
