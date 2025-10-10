'use client'

import { Button, Modal, Typography } from '@/shared/ui'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

type Props = {
  open: boolean
  onOpenChange?: (open: boolean) => void
  email: string
}

export const SentEmailModal = ({ open, email, onOpenChange, ...rest }: Props) => {
  const t = useTranslations('auth.sentEmail')
  const [internalOpen, setInternalOpen] = useState(open)

  useEffect(() => {
    setInternalOpen(open)
  }, [open])

  const handleOpenChange = (isOpen: boolean) => {
    setInternalOpen(isOpen)
    onOpenChange?.(isOpen)
  }

  return (
    <Modal {...rest} open={internalOpen} onOpenChange={handleOpenChange} title={t('title')} overlayOpacity={1}>
      <div style={{ padding: '30px 0 12px' }}>
        <Typography variant="body1" style={{ marginBottom: '18px' }}>
          {t('description', { email })}
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={() => handleOpenChange(false)}>{t('button')}</Button>
        </div>
      </div>
    </Modal>
  )
}
