'use client'

import React from 'react'
import { Button, Modal, Typography } from '@/shared/ui'
import s from './logoutModal.module.scss'

type Props = {
  email?: string
  open: boolean
  onOpenChange: (isOpen: boolean) => void
  onLogout: () => void
}
export const LogoutModal = ({ onLogout, open, onOpenChange, email }: Props) => {
  return (
    <Modal open={open} title="Log Out" onOpenChange={onOpenChange}>
      <div className={s.modal}>
        <Typography variant="body1" className={s.typography}>
          Are you really want to log out of your account?
          {email}
        </Typography>
        <div className={s.buttons}>
          <Button variant={'secondary'} className={s.button} onClick={onLogout}>
            Yes
          </Button>
          <Button
            className={s.button}
            onClick={() => {
              onOpenChange(false)
            }}
          >
            No
          </Button>
        </div>
      </div>
    </Modal>
  )
}
