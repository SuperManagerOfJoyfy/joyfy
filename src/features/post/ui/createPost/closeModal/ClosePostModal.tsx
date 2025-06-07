import { Button, Modal, Typography } from '@/shared/ui'

import s from './ClosePostModal.module.scss'

type ClosePostModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: (saveDraft: boolean) => void
}

export const ClosePostModal = ({ open, onClose, onConfirm }: ClosePostModalProps) => {
  const handleConfirm = (saveDraft: boolean) => () => {
    onConfirm(saveDraft)
  }

  const handleCloseModal = () => {
    onClose()
  }

  return (
    <Modal open={open} onOpenChange={handleCloseModal} title="Close">
      <div className={s.container}>
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
      </div>
    </Modal>
  )
}
