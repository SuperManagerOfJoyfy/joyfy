'use client'

import { ReactNode } from 'react'
import ReactDOM from 'react-dom'

import { Modal, ConfirmModal } from '@/shared/ui'
import { ModalFlow, ModalStep, StepProps } from '../../types/modalTypes'
import { useModalFlow } from '../../hooks/useModalFlow'
import { LeftButton, RightButton } from '../imageFlowButtons/ImageFlowButtons'

export type CreateItemModalProps = {
  open: boolean
  onClose: () => void
  flow: ModalFlow
  initialStep?: ModalStep
  onComplete?: () => void
  hasUnsavedChanges?: () => boolean
  useBuiltInConfirmModal?: boolean
  confirmModalConfig?: {
    title: string
    description: string | ReactNode
  }
  stepProps?: StepProps
  disabled?: boolean
}

export const CreateItemModal = ({
  open,
  onClose,
  flow,
  initialStep,
  onComplete,
  hasUnsavedChanges,
  useBuiltInConfirmModal = true,
  confirmModalConfig = {
    title: 'Close',
    description: 'Are you sure you want to exit without saving changes?',
  },
  stepProps = {},
  disabled = false,
}: CreateItemModalProps) => {
  const {
    currentStep,
    isFirstStep,
    isLastStep,
    isProcessing,
    isConfirmModalOpen,
    handleNext,
    handleBack,
    handleCloseAttempt,
    handleConfirmClose,
    setProcessing,
    jumpToStep,
  } = useModalFlow({
    initialStep: initialStep || flow.steps[0],
    steps: flow.steps,
    onClose,
    onComplete,
    hasUnsavedChanges: useBuiltInConfirmModal ? hasUnsavedChanges : undefined,
  })

  const modalConfig = flow.config[currentStep]
  const StepComponent = flow.components[currentStep]

  const handleMainModalOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      handleCloseAttempt()
    }
  }

  const handleBackWithCleanup = () => {
    const currentStepProps = stepProps[currentStep] || {}

    if (currentStepProps.onNavigateBack) {
      currentStepProps.onNavigateBack()
    }

    handleBack()
  }

  const stepComponentProps = {
    ...(stepProps[currentStep] || {}),
    onNext: handleNext,
    onBack: handleBackWithCleanup,
    onClose: handleCloseAttempt,
    isProcessing,
    setProcessing,
    jumpToStep,
    currentStep,
  }

  const isRightButtonDisabled = () => {
    if (disabled) return true

    const currentStepProps = stepProps[currentStep] || {}

    if (currentStepProps.getValidationState) {
      const validationState = currentStepProps.getValidationState()
      return !validationState.isValid || validationState.isProcessing
    }

    if (currentStepProps.disabled) return true

    return false
  }

  const isLeftButtonDisabled = () => {
    if (disabled) return true

    const currentStepProps = stepProps[currentStep] || {}
    if (currentStepProps.getValidationState) {
      const validationState = currentStepProps.getValidationState()
      if (validationState.isProcessing) return true
    }

    return isProcessing
  }

  const getProcessingState = () => {
    const currentStepProps = stepProps[currentStep] || {}
    if (currentStepProps.getValidationState) {
      const validationState = currentStepProps.getValidationState()
      return validationState.isProcessing
    }
    return isProcessing
  }

  return (
    <>
      <Modal
        open={open}
        onOpenChange={handleMainModalOpenChange}
        title={modalConfig.title}
        size={modalConfig.size}
        cardPadding={modalConfig.cardPadding}
        centerTitle={modalConfig.centerTitle}
        leftButton={
          <LeftButton
            currentStep={currentStep}
            onBack={handleBackWithCleanup}
            disabled={isLeftButtonDisabled()}
            isFirstStep={isFirstStep}
          />
        }
        rightButton={
          <RightButton
            currentStep={currentStep}
            onClose={handleCloseAttempt}
            onNext={handleNext}
            disabled={isRightButtonDisabled()}
            isProcessing={getProcessingState()}
            isLastStep={isLastStep}
            isCreating={getProcessingState()}
          />
        }
      >
        <StepComponent {...stepComponentProps} />
      </Modal>

      {useBuiltInConfirmModal &&
        isConfirmModalOpen &&
        ReactDOM.createPortal(
          <ConfirmModal
            title={confirmModalConfig.title}
            description={confirmModalConfig.description}
            isOpen={isConfirmModalOpen}
            setIsOpen={() => handleConfirmClose(false)}
            onConfirm={() => handleConfirmClose(true)}
          />,
          document.body
        )}
    </>
  )
}
