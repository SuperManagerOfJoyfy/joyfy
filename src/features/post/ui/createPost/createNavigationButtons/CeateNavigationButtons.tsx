import { FiChevronLeft } from 'react-icons/fi'

import { Button } from '@/shared/ui'
import { PostCreationStep } from '@/features/post/types/types'

type LeftButtonProps = {
  currentStep: PostCreationStep
  onBack: (step: PostCreationStep) => void
  disabled?: boolean
}

type RightButtonProps = {
  currentStep: PostCreationStep
  isCreating: boolean
  isUploading: boolean
  onNext: () => void
  onClose: () => void
  disabled?: boolean
}

export const LeftButton = ({ currentStep, onBack, disabled }: LeftButtonProps) => {
  if (currentStep === 'upload') return null

  return (
    <Button variant="icon" onClick={() => onBack(currentStep)} className="button-back" disabled={disabled}>
      <FiChevronLeft size={20} />
    </Button>
  )
}

export const RightButton = ({ currentStep, isCreating, isUploading, onNext, onClose, disabled }: RightButtonProps) => {
  if (currentStep === 'upload') {
    return (
      <Button variant="icon" onClick={onClose} aria-label="Close" disabled={disabled}>
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
