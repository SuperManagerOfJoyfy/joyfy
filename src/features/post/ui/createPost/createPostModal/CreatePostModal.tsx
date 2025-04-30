'use client'

import { useState, useEffect, ReactNode, ReactElement } from 'react'
import { Modal } from '@/shared/ui/modal'
import { PostCreationStep, PublishData } from '@/features/post/types/types'
import { StepCrop } from '../steps/stepCrop/StepCrop'
import { StepDescription } from '../steps/stepDescription/StepDescription'
import { ClosePostModal } from '../closeModal/ClosePostModal'
import { StepFilters } from '../steps/stepFilters/StepFilters'
import { StepUpload } from '../steps/stepUpload'
import { useImageHandling } from '@/features/post/hooks/useImageHandler'
import ReactDOM from 'react-dom'
import { toast } from 'react-toastify'
import { Button } from '@/shared/ui'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

type CreatePostModalProps = {
  open: boolean
  onClose: () => void
  onPublish: (formData: PublishData) => void
}

export const CreatePostModal = ({ open, onClose, onPublish }: CreatePostModalProps) => {
  const {
    selectedFiles,
    imagePreviews,
    currentImageIndex,
    setCurrentImageIndex,
    error,
    setError,
    processFiles,
    handlePrevImage,
    handleNextImage,
    imageSettings,
    updateCurrentImageSetting,
    getCurrentImageSettings,
    clearAllData,
  } = useImageHandling()

  const [currentStep, setCurrentStep] = useState<PostCreationStep>('upload')
  const [description, setDescription] = useState('')
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  // useEffect(() => {
  //   if (open) {
  //     const draft = loadDraft()
  //     if (draft) {
  //       if (draft.step) {
  //         setCurrentStep(draft.step)
  //       }
  //       if (draft.description) {
  //         setDescription(draft.description)
  //       }
  //       if (typeof draft.currentImageIndex === 'number') {
  //         setCurrentImageIndex(draft.currentImageIndex)
  //       }
  //     }
  //   }
  // }, [open, loadDraft, setCurrentImageIndex])

  const handleMainModalOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      handleCloseButtonClick()
    }
  }

  const handleCloseButtonClick = () => {
    const hasContent = selectedFiles.length > 0 || description.trim() !== ''

    if (hasContent) {
      setIsCloseModalOpen(true)
    } else {
      onClose()
    }
  }

  const handleFilesSelected = (files: File[]) => {
    const validFiles = processFiles(files)
    if (validFiles.length > 0) {
      setCurrentStep('crop')
    }
  }

  const handleCropComplete = () => {
    setCurrentStep('filter')
  }

  const handleFilterComplete = () => {
    setCurrentStep('description')
  }

  const handleDescriptionChange = (text: string) => {
    setDescription(text)
  }

  const handlePublish = async () => {
    try {
      setIsPublishing(true)
      setError(null)

      await onPublish({
        files: selectedFiles,
        description,
        imageSettings,
      })

      clearAllData()
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to publish post')
      setError(err instanceof Error ? err.message : 'Failed to publish post')
    } finally {
      setIsPublishing(false)
    }
  }

  const handleBack = (step: PostCreationStep) => {
    setCurrentStep(step)
  }

  const handleConfirmClose = (saveDraft: boolean) => {
    if (!saveDraft) {
      clearAllData()
      toast.info('Draft discarded')
    } else {
      toast.info('Draft saved')
    }
    setIsCloseModalOpen(false)
    onClose()
  }

  const getModalTitle = () => {
    switch (currentStep) {
      case 'upload':
        return 'Add Photo'
      case 'crop':
        return 'Cropping'
      case 'filter':
        return 'Filters'
      case 'description':
        return 'Publication'
      default:
        return 'Add Photo'
    }
  }

  const getModalSize = () => {
    if (currentStep === 'filter') return 'lg'
    if (currentStep === 'description') return 'lg'
    return 'md'
  }

  const renderLeftButton = (): ReactElement | null => {
    // Don't show any left button on the initial upload step (with or without files)
    if (currentStep === 'upload') {
      return null
    }

    const handleBackClick = () => {
      // Navigate to previous step
      switch (currentStep) {
        case 'crop':
          handleBack('upload')
          break
        case 'filter':
          handleBack('crop')
          break
        case 'description':
          handleBack('filter')
          break
      }
    }

    return (
      <Button variant="text" onClick={handleBackClick} className="button-back">
        <FiChevronLeft size={20} />
        Back
      </Button>
    )
  }

  const renderRightButton = (): ReactElement | null => {
    // For the upload step, we show a close (X) button regardless of whether files are selected
    if (currentStep === 'upload') {
      return (
        <Button variant="icon" onClick={handleCloseButtonClick} aria-label="Close">
          ✕
        </Button>
      )
    }

    // For other steps (crop, filter, description)
    const handleNextClick = () => {
      switch (currentStep) {
        case 'crop':
          handleCropComplete()
          break
        case 'filter':
          handleFilterComplete()
          break
        case 'description':
          handlePublish()
          break
      }
    }

    const getButtonText = () => {
      if (currentStep === 'description') {
        return isPublishing ? 'Publishing...' : 'Publish'
      }
      return 'Next'
    }

    const isDisabled = currentStep === 'description' && (isPublishing || description.trim().length === 0)

    return (
      <Button variant="text" onClick={handleNextClick} disabled={isDisabled} className="button-next">
        {getButtonText()}
      </Button>
    )
  }

  return (
    <>
      <Modal
        open={open}
        onOpenChange={handleMainModalOpenChange}
        title={getModalTitle()}
        size={getModalSize()}
        leftButton={renderLeftButton()}
        rightButton={renderRightButton()}
      >
        {currentStep === 'upload' && (
          <StepUpload onClose={handleCloseButtonClick} onNext={handleFilesSelected} error={error} setError={setError} />
        )}

        {currentStep === 'crop' && (
          <StepCrop
            files={selectedFiles}
            imagePreviews={imagePreviews}
            currentImageIndex={currentImageIndex}
            onImageIndexChange={setCurrentImageIndex}
            onPrevImage={handlePrevImage}
            onNextImage={handleNextImage}
            onBack={() => handleBack('upload')}
            onNext={handleCropComplete}
            initialAspectRatio={getCurrentImageSettings().aspectRatio}
            initialZoom={getCurrentImageSettings().zoom}
            onAspectRatioChange={(ratio) => updateCurrentImageSetting({ aspectRatio: ratio })}
            onZoomChange={(zoom) => updateCurrentImageSetting({ zoom })}
          />
        )}

        {currentStep === 'filter' && (
          <StepFilters
            files={selectedFiles}
            imagePreviews={imagePreviews}
            currentImageIndex={currentImageIndex}
            onImageIndexChange={setCurrentImageIndex}
            onPrevImage={handlePrevImage}
            onNextImage={handleNextImage}
            aspectRatio={getCurrentImageSettings().aspectRatio}
            zoom={getCurrentImageSettings().zoom}
            initialFilter={getCurrentImageSettings().filter}
            onBack={() => handleBack('crop')}
            onNext={handleFilterComplete}
            onFilterChange={(filter) => updateCurrentImageSetting({ filter })}
          />
        )}

        {currentStep === 'description' && (
          <StepDescription
            files={selectedFiles}
            imagePreviews={imagePreviews}
            currentImageIndex={currentImageIndex}
            onImageIndexChange={setCurrentImageIndex}
            onPrevImage={handlePrevImage}
            onNextImage={handleNextImage}
            imageSettings={imageSettings}
            initialDescription={description}
            onDescriptionChange={handleDescriptionChange}
            onBack={() => handleBack('filter')}
            onPublish={handlePublish}
            isPublishing={isPublishing}
            error={error}
          />
        )}
      </Modal>

      {currentStep &&
        isCloseModalOpen &&
        ReactDOM.createPortal(
          <ClosePostModal
            open={isCloseModalOpen}
            onClose={() => setIsCloseModalOpen(false)}
            onConfirm={handleConfirmClose}
          />,
          document.body
        )}
    </>
  )
}
