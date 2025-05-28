import { FiChevronLeft } from 'react-icons/fi'

import { Button } from '@/shared/ui'
import { FlowType, StepByFlow } from '@/features/post/ui/createPost/createPostModal'

type LeftButtonProps<T extends FlowType> = {
  currentStep: StepByFlow<T>
  onBack: (step: StepByFlow<T>) => void
  disabled?: boolean
}

type RightButtonProps<T extends FlowType> = {
  currentStep: StepByFlow<T>
  isCreating: boolean
  isUploading: boolean
  onNext: () => void
  onClose: () => void
  disabled?: boolean
}

export const LeftButton = <T extends FlowType>({ currentStep, onBack, disabled }: LeftButtonProps<T>) => {
  if (currentStep === 'upload') return null

  return (
    <Button variant="icon" onClick={() => onBack(currentStep)} className="button-back" disabled={disabled}>
      <FiChevronLeft size={20} />
    </Button>
  )
}

export const RightButton = <T extends FlowType>({
  currentStep,
  isCreating,
  isUploading,
  onNext,
  onClose,
  disabled,
}: RightButtonProps<T>) => {
  if (currentStep === 'upload' || currentStep === 'position') {
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
