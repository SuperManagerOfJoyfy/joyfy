'use client'

import { useState } from 'react'
import { Button, Checkbox, Modal, Typography } from '@/shared/ui'
import s from './paymentModal.module.scss'
import Loading from '@/app/loading'

type Props = {
  open: boolean
  onOpenChange: (value: boolean) => void
  handleSubmit: () => void
}

export const PaymentModal = ({ open, onOpenChange, handleSubmit }: Props) => {
  const [step, setStep] = useState<'initial' | 'loading' | 'success' | 'error'>('initial')
  const [agreed, setAgreed] = useState(false)

  const handlePayment = async () => {
    setStep('loading')

    try {
      handleSubmit()
      setStep('success')
    } catch {
      setStep('error')
    }
  }

  const handleClose = () => {
    setStep('initial')
    setAgreed(false)
    onOpenChange(false)
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Create payment">
      <div className={s.modalWrapper}>
        {step === 'initial' && (
          <>
            <Typography variant="body1">
              Auto-renewal will be enabled with this payment. You can disable it anytime in your profile settings.
            </Typography>

            <div className={s.buttonWrapper}>
              <Checkbox label="I agree*" checked={agreed} onCheckedChange={(agreed) => setAgreed(!!agreed)} />
              <Button onClick={handlePayment} disabled={!agreed}>
                OK
              </Button>
            </div>
          </>
        )}

        {step === 'loading' && <Loading />}

        {step === 'success' && (
          <>
            <Typography variant="body1">Payment was successful!</Typography>
            <Button onClick={handleClose}>Ok</Button>
          </>
        )}

        {step === 'error' && (
          <>
            <Typography variant="body1">Transaction failed. Please, write to support</Typography>
            <Button onClick={() => setStep('initial')}>Back to payment</Button>
          </>
        )}
      </div>
    </Modal>
  )
}
