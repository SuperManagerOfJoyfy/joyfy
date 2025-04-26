'use client'

import { Button, Modal, Typography } from '@/shared/ui'

import s from './ClosePostModal.module.css'

type ClosePostModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: (saveDraft: boolean) => void
}

export const ClosePostModal = ({ open, onClose, onConfirm }: ClosePostModalProps) => {
  return (
    <Modal open={open} onOpenChange={onClose} title="Close">
      <div className={s.container}>
        <Typography>Do you really want to close the creation of a publication?</Typography>
        <Typography>If you close everything will be deleted</Typography>
        <div className={s.buttonContainer}>
          <Button
            variant="outline"
            onClick={() => {
              onConfirm(false)
              // onClose()
            }}
            title="Discard"
          >
            Discard
          </Button>
          <Button
            onClick={() => {
              onConfirm(true)
              // onClose()
            }}
            title="Save draft"
          >
            Save draft
          </Button>
        </div>
      </div>
    </Modal>
  )
}
