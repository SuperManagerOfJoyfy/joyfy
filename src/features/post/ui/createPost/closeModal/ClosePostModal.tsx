'use client'

import { Button, Modal, Typography } from '@/shared/ui'
import { useTranslations } from 'next-intl'

import s from './ClosePostModal.module.scss'

type ClosePostModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: (saveDraft: boolean) => void
  hasContent: boolean
  isSaving?: boolean
}

export const ClosePostModal = ({ open, onClose, onConfirm, hasContent, isSaving = false }: ClosePostModalProps) => {
  const t = useTranslations('closePostModal')

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
    <Modal open={open} onOpenChange={handleModalClose} title={t('title')}>
      <div className={s.container}>
        <Typography variant="body1">{t('confirm')}</Typography>

        {hasContent && (
          <Typography variant="body2" className={s.warningText}>
            {t('warning')}
          </Typography>
        )}

        <div className={s.buttonContainer}>
          <Button
            variant="outline"
            onClick={() => handleAction('discard')}
            title={t('buttons.discard')}
            aria-label={t('buttons.discardAria')}
            disabled={isSaving}
          >
            {t('buttons.discard')}
          </Button>

          {hasContent && (
            <Button
              onClick={() => handleAction('save')}
              title={t('buttons.saveDraft')}
              aria-label={t('buttons.saveDraftAria')}
              disabled={isSaving}
            >
              {isSaving ? t('buttons.saving') : t('buttons.saveDraft')}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
