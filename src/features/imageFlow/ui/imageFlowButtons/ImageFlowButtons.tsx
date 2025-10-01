import clsx from 'clsx'
import { FiChevronLeft } from 'react-icons/fi'
import { Button } from '@/shared/ui'
import { ModalStep } from '../../types/modalTypes'
import s from './ImageFlowButtons.module.scss'
import { useTranslations } from 'next-intl'

type LeftButtonProps = {
  currentStep: ModalStep
  onBack: () => void
  disabled?: boolean
  isFirstStep: boolean
}

type RightButtonProps = {
  currentStep: ModalStep
  onNext: () => void
  onClose: () => void
  disabled?: boolean
  isProcessing?: boolean
  isLastStep: boolean
  isCreating?: boolean
}

export const LeftButton = ({ currentStep, onBack, disabled, isFirstStep }: LeftButtonProps) => {
  if (currentStep === 'upload' || currentStep === 'avatar-upload' || isFirstStep) return null
  return (
    <Button variant="icon" onClick={onBack} className="button-back" disabled={disabled}>
      <FiChevronLeft size={20} />
    </Button>
  )
}

export const RightButton = ({
  currentStep,
  onNext,
  onClose,
  disabled,
  isProcessing = false,
  isCreating = false,
}: RightButtonProps) => {
  const t = useTranslations('flow.buttons')

  if (currentStep === 'upload' || currentStep === 'avatar-upload' || currentStep === 'avatar-position') {
    return (
      <Button
        variant="icon"
        onClick={onClose}
        aria-label={t('closeAria')}
        disabled={disabled}
        className={clsx(currentStep === 'avatar-position' ? s.closeBtn : '')}
      >
        ✕
      </Button>
    )
  }

  const text = currentStep === 'description' ? (isCreating || isProcessing ? t('publishing') : t('publish')) : t('next')

  return (
    <Button variant="text" onClick={onNext} disabled={disabled || isProcessing || isCreating} className="button-next">
      {text}
    </Button>
  )
}
