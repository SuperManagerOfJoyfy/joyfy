'use client'

import React from 'react'
import { Button, Modal, Typography } from '@/shared/ui'

type Props = {
  open: boolean
  onOpenChange: (isOpen: boolean) => void
  onConfirm: () => void
}
export const LogoutModal = ({ onConfirm, open, onOpenChange }: Props) => {
  return (
    <Modal open={open} title="Logout" onOpenChange={onOpenChange}>
      <div style={{ padding: '30px 0 12px' }}>
        <Typography variant="body1" style={{ marginBottom: '18px' }}>
          Are you really want to log out of your account?
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button style={{ margin: '10px' }} onClick={() => {onOpenChange(false)}}>
            No
          </Button>
          <Button style={{ margin: '10px' }} onClick={onConfirm}>
            Yes
          </Button>
        </div>
      </div>
    </Modal>
  )
}
