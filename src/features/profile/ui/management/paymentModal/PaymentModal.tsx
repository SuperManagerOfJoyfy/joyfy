'use client'

import { useEffect, useState } from 'react'
import { Button, Checkbox, Modal, Typography } from '@/shared/ui'
import s from './paymentModal.module.scss'
import Loading from '@/app/[locale]/loading'
import { useTranslations } from 'next-intl'

type Props = {
  open: boolean
  onOpenChange: (value: boolean) => void
  handleSubmit: () => Promise<void>
  initialStep?: 'success' | 'error'
}

export const PaymentModal = ({ open, onOpenChange, handleSubmit, initialStep }: Props) => {
  const t = useTranslations('paymentModal')

  const [step, setStep] = useState<'initial' | 'loading' | 'success' | 'error'>('initial')
  const [agreed, setAgreed] = useState(false)

  useEffect(() => {
    if (initialStep === 'success' || initialStep === 'error') {
      setStep(initialStep)
    }
  }, [initialStep])

  const handlePayment = async () => {
    setStep('loading')
    try {
      await handleSubmit()
    } catch {
      console.error('error creating payment')
    }
  }

  const handleClose = () => {
    setStep('initial')
    setAgreed(false)
    onOpenChange(false)
  }

  return (
    <Modal
      open={open}
      onOpenChange={initialStep === 'error' || initialStep === 'success' ? handleClose : onOpenChange}
      title={t('title')}
    >
      <div className={s.modalWrapper}>
        {step === 'initial' && (
          <>
            <Typography variant="body1">{t('initial.text')}</Typography>

            <div className={s.buttonWrapper}>
              <Checkbox label={t('initial.agree')} checked={agreed} onCheckedChange={(agreed) => setAgreed(!!agreed)} />
              <Button onClick={handlePayment} disabled={!agreed}>
                {t('initial.ok')}
              </Button>
            </div>
          </>
        )}

        {step === 'loading' && <Loading />}

        {step === 'success' && (
          <>
            <Typography variant="body1">{t('success.text')}</Typography>
            <Button onClick={handleClose}>{t('success.button')}</Button>
          </>
        )}

        {step === 'error' && (
          <>
            <Typography variant="body1">{t('error.text')}</Typography>
            <Button onClick={handleClose}>{t('error.button')}</Button>
          </>
        )}
      </div>
    </Modal>
  )
}
