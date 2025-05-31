import { FiChevronLeft } from 'react-icons/fi'
import clsx from 'clsx'

import { Button } from '@/shared/ui'
import { PostCreationStep } from '@/features/post/types/types'

import s from './ImageFlowButtons.module.scss'

type AvatarStep = 'avatar-upload' | 'avatar-position'

type AllSteps = PostCreationStep | AvatarStep

type LeftButtonProps<T extends AllSteps = AllSteps> = {
  currentStep: T
  onBack: (step: T) => void
  disabled?: boolean
}

type RightButtonProps<T extends AllSteps = AllSteps> = {
  currentStep: T
  isCreating?: boolean
  isUploading?: boolean
  onNext: () => void
  onClose: () => void
  disabled?: boolean
}

export const LeftButton = <T extends AllSteps = AllSteps>({ currentStep, onBack, disabled }: LeftButtonProps<T>) => {
  if (currentStep === 'upload' || currentStep === 'avatar-upload') return null

  return (
    <Button variant="icon" onClick={() => onBack(currentStep)} className="button-back" disabled={disabled}>
      <FiChevronLeft size={20} />
    </Button>
  )
}

export const RightButton = <T extends AllSteps = AllSteps>({
  currentStep,
  isCreating = false,
  isUploading = false,
  onNext,
  onClose,
  disabled,
}: RightButtonProps<T>) => {
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
      return isCreating ? 'Publishing...' : 'Publish'
    }
    return 'Next'
  }

  return (
    <Button variant="text" onClick={onNext} disabled={disabled} className="button-next">
      {getButtonText()}
    </Button>
  )
}
