'use client'

import React from 'react'
import { Button, Modal, Typography } from '@/shared/ui'

type Props = {
  email?: string
  open: boolean
  onOpenChange: (isOpen: boolean) => void
  onLogout: () => void
}
export const LogoutModal = ({ onLogout, open, onOpenChange }: Props) => {
  return (
    <Modal open={open} title="Log Out" onOpenChange={onOpenChange}>
      <div style={{ padding: '30px 0 12px' }}>
        <Typography variant="body1" style={{ marginBottom: '18px' }}>
          Are you really want to log out of your account?
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant={'secondary'} style={{ margin: '10px' }} onClick={onLogout}>
            Yes
          </Button>
          <Button style={{ margin: '10px' }} onClick={() => {onOpenChange(false)}}>
            No
          </Button>
        </div>
      </div>
    </Modal>
  )
}