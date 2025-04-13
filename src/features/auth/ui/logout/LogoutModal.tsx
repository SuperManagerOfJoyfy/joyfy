'use client'

import React from 'react'
import { Button, Modal, Typography } from '@/shared/ui'
import s from './logoutModal.module.scss'
import Link from 'next/link'
import { PATH } from '@/shared/config/routes'

type Props = {
  email?: string
  open: boolean
  onOpenLogoutModalHandler: (value: boolean) => void
  onLogout: () => Promise<'success' | 'unauthorized' | 'error'>
}
export const LogoutModal = ({
  onLogout,
  open,
  onOpenLogoutModalHandler,
  email,
}: Props) => {
  return (
    <Modal
      open={open}
      title="Log Out"
      onOpenChange={() => onOpenLogoutModalHandler(false)}
    >
      <div className={s.modal}>
        <Typography variant="body1" className={s.typography}>
          Are you really want to log out of your account?
          {email}
        </Typography>
        <div className={s.buttons}>
          <Button
            as={Link}
            href={PATH.AUTH.LOGIN}
            variant={'secondary'}
            className={s.button}
            onClick={onLogout}
          >
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
