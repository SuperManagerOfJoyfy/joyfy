import { Button, Modal, Typography } from '@/shared/ui'

import s from './ClosePostModal.module.scss'

type ClosePostModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: (saveDraft: boolean) => void
  hasContent: boolean
  isSaving?: boolean
}

const MODAL_CONTENT = {
  title: 'Close',
  confirmationText: 'Do you really want to close the creation of a publication?',
  warningText: 'If you close, everything will be deleted.',
  buttons: {
    discard: {
      text: 'Discard',
      ariaLabel: 'Discard the publication creation',
    },
    saveDraft: {
      text: 'Save draft',
      loadingText: 'Saving...',
      ariaLabel: 'Save the publication as draft',
    },
  },
} as const

export const ClosePostModal = ({ open, onClose, onConfirm, hasContent, isSaving = false }: ClosePostModalProps) => {
  const handleAction = (action: 'discard' | 'save') => {
    if (isSaving) return

    const saveDraft = action === 'save'
    onConfirm(saveDraft)
  }

  const handleModalClose = () => {
    if (isSaving) return
    onClose()
  }

  return (
    <Modal open={open} onOpenChange={handleModalClose} title={MODAL_CONTENT.title}>
      <div className={s.container}>
        <Typography variant="body1">{MODAL_CONTENT.confirmationText}</Typography>

        {hasContent && (
          <Typography variant="body2" className={s.warningText}>
            {MODAL_CONTENT.warningText}
          </Typography>
        )}

        <div className={s.buttonContainer}>
          <Button
            variant="outline"
            onClick={() => handleAction('discard')}
            title={MODAL_CONTENT.buttons.discard.text}
            aria-label={MODAL_CONTENT.buttons.discard.ariaLabel}
            disabled={isSaving}
          >
            {MODAL_CONTENT.buttons.discard.text}
          </Button>

          {hasContent && (
            <Button
              onClick={() => handleAction('save')}
              title={MODAL_CONTENT.buttons.saveDraft.text}
              aria-label={MODAL_CONTENT.buttons.saveDraft.ariaLabel}
              disabled={isSaving}
            >
              {isSaving ? MODAL_CONTENT.buttons.saveDraft.loadingText : MODAL_CONTENT.buttons.saveDraft.text}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
