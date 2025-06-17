import { useState, useCallback } from 'react'

import { ModalStep } from '../types/modalTypes'

export type UseModalFlowProps = {
  initialStep: ModalStep
  steps: ModalStep[]
  onClose: () => void
  onComplete?: () => void
  hasUnsavedChanges?: () => boolean
}

export const useModalFlow = ({ initialStep, steps, onClose, onComplete, hasUnsavedChanges }: UseModalFlowProps) => {
  const [currentStep, setCurrentStep] = useState<ModalStep>(initialStep)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const currentStepIndex = steps.indexOf(currentStep)
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1

  const handleNext = useCallback(() => {
    if (isLastStep) {
      onComplete?.()
    } else {
      const nextStep = steps[currentStepIndex + 1]
      setCurrentStep(nextStep)
    }
  }, [currentStepIndex, isLastStep, steps, onComplete])

  const handleBack = useCallback(() => {
    if (!isFirstStep) {
      const prevStep = steps[currentStepIndex - 1]
      setCurrentStep(prevStep)
    }
  }, [currentStepIndex, isFirstStep, steps])

  const handleCloseAttempt = useCallback(() => {
    if (hasUnsavedChanges?.()) {
      setIsConfirmModalOpen(true)
    } else {
      onClose()
    }
  }, [hasUnsavedChanges, onClose])

  const handleConfirmClose = useCallback(
    (confirmed: boolean) => {
      setIsConfirmModalOpen(false)
      if (confirmed) {
        onClose()
      }
    },
    [onClose]
  )

  const setProcessing = useCallback((processing: boolean) => {
    setIsProcessing(processing)
  }, [])

  const jumpToStep = useCallback(
    (step: ModalStep) => {
      if (steps.includes(step)) {
        setCurrentStep(step)
      }
    },
    [steps]
  )

  return {
    currentStep,
    currentStepIndex,
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
    setCurrentStep,
  }
}
