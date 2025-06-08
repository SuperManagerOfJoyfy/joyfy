'use client'

import { useState } from 'react'
import { Button, Checkbox, Modal, Typography } from '@/shared/ui'
import s from './paymentModal.module.scss'

type Props = {
  open: boolean
  onOpenChange: (value: boolean) => void
}

export const PaymentModal = ({ open, onOpenChange }: Props) => {
  const [agreed, setAgreed] = useState(false)

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Create payment">
      <div className={s.modalWrapper}>
        <Typography variant="body1">
          Auto-renewal will be enabled with this payment. You can disable it anytime in your profile settings.
        </Typography>

        <div className={s.buttonWrapper}>
          <Checkbox label="I agree" checked={agreed} onCheckedChange={(agreed) => setAgreed(!!agreed)} />
          <Button disabled={!agreed}>OK</Button>
        </div>
      </div>
    </Modal>
  )
}
