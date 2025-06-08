import { FiChevronLeft } from 'react-icons/fi'
import clsx from 'clsx'

import { Button } from '@/shared/ui'
import { ModalStep } from '../../types/modalTypes'

import s from './ImageFlowButtons.module.scss'

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
  if (currentStep === 'upload' || currentStep === 'avatar-upload' || currentStep === 'avatar-position') {
    return (
      <Button
        variant="icon"
        onClick={onClose}
        aria-label="Close"
        disabled={disabled}
        className={clsx(currentStep === 'avatar-position' ? s.closeBtn : '')}
      >
        ✕
      </Button>
    )
  }

  const getButtonText = () => {
    if (currentStep === 'description') {
      return isCreating || isProcessing ? 'Publishing...' : 'Publish'
    }
    return 'Next'
  }

  return (
    <Button variant="text" onClick={onNext} disabled={disabled || isProcessing || isCreating} className="button-next">
      {getButtonText()}
    </Button>
  )
}
