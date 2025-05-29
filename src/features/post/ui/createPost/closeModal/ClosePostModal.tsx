'use client'

import { Button, Modal, Typography } from '@/shared/ui'

import s from './ClosePostModal.module.scss'

type ClosePostModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: (saveDraft: boolean) => void
  variant: 'post' | 'avatar'
}

export const ClosePostModal = ({ open, onClose, onConfirm, variant }: ClosePostModalProps) => {
  const handleConfirm = (saveDraft: boolean) => () => {
    onConfirm(saveDraft)
  }

  const renderContent = () => {
    if (variant === 'post') {
      return (
        <>
          <Typography variant="body1">Do you really want to close the creation of a publication?</Typography>
          <Typography variant="body2" className={s.warningText}>
            If you close, everything will be deleted.
          </Typography>
          <div className={s.buttonContainer}>
            <Button
              variant="outline"
              onClick={handleConfirm(false)}
              title="Discard"
              aria-label="Discard the publication creation"
            >
              Discard
            </Button>
            <Button onClick={handleConfirm(true)} title="Save draft" aria-label="Save the publication as draft">
              Save draft
            </Button>
          </div>
        </>
      )
    }
    return (
      <>
        <Typography variant="body1">Are you sure you want to exit without saving changes?</Typography>
        <div className={s.buttonContainer}>
          <Button variant="outline" onClick={onClose} title="No">
            No
          </Button>
          <Button onClick={handleConfirm(false)} title="Yes">
            Yes
          </Button>
        </div>
      </>
    )
  }

  return (
    <Modal open={open} onOpenChange={onClose} title="Close">
      <div className={s.container}>{renderContent()}</div>
    </Modal>
  )
}
