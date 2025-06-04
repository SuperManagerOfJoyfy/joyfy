'use client'

import { useState } from 'react'
import ReactDOM from 'react-dom'
import { IoImageOutline } from 'react-icons/io5'

import { Modal, ConfirmModal } from '@/shared/ui'
import { FullImageUpload } from '@/features/imageFlow/ui/fullImageUpload/FullImageUpload'
import { getModalConfig } from '@/features/imageFlow/utils/modalUtils'
import { LeftButton, RightButton } from '@/features/imageFlow/ui/imageFlowButtons/ImageFlowButtons'
import { ACCEPTED_TYPES, MAX_FILE_SIZE_MB, MAX_IMAGES } from '@/features/profile/utils'
import { StepAvatarPosition } from '../stepAvatarPosition/StepAvatarPosition'

type AvatarModalProps = {
  open: boolean
  onClose: () => void
}

type AvatarStep = 'avatar-upload' | 'avatar-position'

export const AvatarModal = ({ open, onClose }: AvatarModalProps) => {
  const [currentStep, setCurrentStep] = useState<AvatarStep>('avatar-upload')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

  const modalConfig = getModalConfig(currentStep)

  const handleMainModalOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      handleCloseButtonClick()
    }
  }

  const handleCloseButtonClick = () => {
    if (selectedImage) {
      setIsConfirmModalOpen(true)
    } else {
      handleClose()
    }
  }

  const handleClose = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage)
    }
    setSelectedImage(null)
    setCurrentStep('avatar-upload')
    onClose()
  }

  const handleFilesSelected = (files: File[]) => {
    const selectedFile = files[0]

    if (selectedImage) {
      URL.revokeObjectURL(selectedImage)
    }

    const imageUrl = URL.createObjectURL(selectedFile)
    setSelectedImage(imageUrl)
    setCurrentStep('avatar-position')
  }

  const handleBack = (step: AvatarStep) => {
    if (step === 'avatar-position') {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage)
      }
      setSelectedImage(null)
      setCurrentStep('avatar-upload')
    }
  }

  const handleAvatarUpload = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage)
    }
    handleClose()
  }

  const handleConfirmClose = (confirm: boolean) => {
    setIsConfirmModalOpen(false)
    if (confirm) {
      handleClose()
    }
  }

  const handleNext = () => {
    handleAvatarUpload()
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
        leftButton={<LeftButton currentStep={currentStep} onBack={handleBack} disabled={false} />}
        rightButton={
          <RightButton
            currentStep={currentStep}
            onClose={handleCloseButtonClick}
            onNext={handleNext}
            disabled={false}
          />
        }
      >
        {currentStep === 'avatar-upload' && (
          <FullImageUpload
            showDraftButton={false}
            largeBottomPadding={true}
            onFilesSelected={handleFilesSelected}
            placeholder=""
            dragPlaceholder="Drop your profile photo here"
            primaryButtonText="Select Photo"
            icon={<IoImageOutline size={50} />}
            maxImages={MAX_IMAGES}
            acceptedTypes={ACCEPTED_TYPES}
            maxFileSize={MAX_FILE_SIZE_MB}
          />
        )}

        {currentStep === 'avatar-position' && selectedImage && (
          <StepAvatarPosition imageSrc={selectedImage} onUpload={handleAvatarUpload} />
        )}
      </Modal>

      {isConfirmModalOpen &&
        ReactDOM.createPortal(
          <ConfirmModal
            title="Close"
            description="Are you sure you want to exit without saving changes?"
            isOpen={isConfirmModalOpen}
            setIsOpen={() => setIsConfirmModalOpen(false)}
            onConfirm={() => handleConfirmClose(true)}
          />,
          document.body
        )}
    </>
  )
}
