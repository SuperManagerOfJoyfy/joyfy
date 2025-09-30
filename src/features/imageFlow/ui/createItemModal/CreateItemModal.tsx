'use client'

import { ReactNode } from 'react'
import ReactDOM from 'react-dom'
import { useTranslations } from 'next-intl'
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
  confirmModalConfig?: { title?: string; description?: string | ReactNode }
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
  confirmModalConfig,
  stepProps = {},
  disabled = false,
}: CreateItemModalProps) => {
  const tConfirm = useTranslations('flow.confirm')
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
    if (!newOpen) handleCloseAttempt()
  }

  const handleBackWithCleanup = () => {
    const currentStepProps = stepProps[currentStep] || {}
    currentStepProps.onNavigateBack?.()
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
    const p = stepProps[currentStep] || {}
    const v = p.getValidationState?.()
    if (v) return !v.isValid || v.isProcessing
    return !!p.disabled
  }

  const isLeftButtonDisabled = () => {
    if (disabled) return true
    const v = stepProps[currentStep]?.getValidationState?.()
    if (v?.isProcessing) return true
    return isProcessing
  }

  const processingState = stepProps[currentStep]?.getValidationState?.()?.isProcessing ?? isProcessing

  const confirmTitle = confirmModalConfig?.title ?? tConfirm('title')
  const confirmDescription = confirmModalConfig?.description ?? tConfirm('description')

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
            isProcessing={processingState}
            isLastStep={isLastStep}
            isCreating={processingState}
          />
        }
      >
        <StepComponent {...stepComponentProps} />
      </Modal>

      {useBuiltInConfirmModal &&
        isConfirmModalOpen &&
        ReactDOM.createPortal(
          <ConfirmModal
            title={confirmTitle}
            description={confirmDescription}
            isOpen={isConfirmModalOpen}
            setIsOpen={() => handleConfirmClose(false)}
            onConfirm={() => handleConfirmClose(true)}
          />,
          document.body
        )}
    </>
  )
}
