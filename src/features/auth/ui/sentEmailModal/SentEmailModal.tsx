import { Button, Modal, Typography } from '@/shared/ui'
import React, { useEffect, useState } from 'react'
import s from './SentEmailModal.module.scss'

type Props = {
  open: boolean
  onOpenChange?: (open: boolean) => void
  email: string
}

 export const SentEmailModal = ({ open, email, onOpenChange, ...rest }: Props) => {
  const [internalOpen, setInternalOpen] = useState(open)

  useEffect(() => {
    setInternalOpen(open)
  }, [open])

  const handleOpenChange = (isOpen: boolean) => {
    setInternalOpen(isOpen)
    onOpenChange?.(isOpen)
  }

  return (
    <>
      <Modal
        {...rest}
        open={internalOpen}
        onOpenChange={handleOpenChange}
        title="Email sent"
        className={s.modalOverlay}
        overlayOpacity={1}
      >
        <div style={{ padding: '30px 0 12px' }}>
          <Typography variant="body1" style={{ marginBottom: '18px' }}>
            We have sent a link to confirm your email to {email}
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => handleOpenChange(false)}>OK</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
