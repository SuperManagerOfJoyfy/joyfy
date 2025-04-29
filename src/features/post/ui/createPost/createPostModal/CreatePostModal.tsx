'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/shared/ui/modal'
import { PostCreationStep, PublishData } from '@/features/post/types/types'
import { StepCrop } from '../steps/stepCrop/StepCrop'
import { StepDescription } from '../steps/stepDescription/StepDescription'
import { ClosePostModal } from '../closeModal/ClosePostModal'
import { usePostDraft } from '@/features/post/hooks/usePostDraft'
import { StepFilters } from '../steps/stepFilters/StepFilters'
import { StepUpload } from '../steps/stepUpload'
import { useImageHandling } from '@/features/post/hooks/useImageHandler'
import ReactDOM from 'react-dom'
import { toast } from 'react-toastify'

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

  const { saveCompleteDraft, loadDraft, clearDraft, hasDraft } = usePostDraft()

  // Load draft when modal opens
  useEffect(() => {
    if (open) {
      const draft = loadDraft()
      if (draft) {
        if (draft.step) {
          setCurrentStep(draft.step)
        }
        if (draft.description) {
          setDescription(draft.description)
        }
        if (typeof draft.currentImageIndex === 'number') {
          setCurrentImageIndex(draft.currentImageIndex)
        }
      }
    }
  }, [open, loadDraft, setCurrentImageIndex])

  const handleMainModalOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      handleCloseButtonClick()
    }
  }

  const handleCloseButtonClick = () => {
    const hasContent = selectedFiles.length > 0 || description.trim() !== '' || hasDraft()

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
      saveCompleteDraft('crop', currentImageIndex, imageSettings)
    }
  }

  const handleCropComplete = () => {
    setCurrentStep('filter')
    saveCompleteDraft('filter', currentImageIndex, imageSettings)
  }

  const handleFilterComplete = () => {
    setCurrentStep('description')
    saveCompleteDraft('description', currentImageIndex, imageSettings, description)
  }

  const handleDescriptionChange = (text: string) => {
    setDescription(text)
    saveCompleteDraft(currentStep, currentImageIndex, imageSettings, text)
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

      clearDraft()
      clearAllData()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to publish post')
      setError(err instanceof Error ? err.message : 'Failed to publish post')
    } finally {
      setIsPublishing(false)
    }
  }

  const handleBack = (step: PostCreationStep) => {
    setCurrentStep(step)
    saveCompleteDraft(step, currentImageIndex, imageSettings, description)
  }

  const handleConfirmClose = (saveDraft: boolean) => {
    if (!saveDraft) {
      clearDraft()
      clearAllData()
      toast.info('Draft discarded')
    } else {
      saveCompleteDraft(currentStep, currentImageIndex, imageSettings, description)
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

  const currentSettings = getCurrentImageSettings()

  return (
    <>
      <Modal open={open} onOpenChange={handleMainModalOpenChange} title={getModalTitle()} size={getModalSize()}>
        {currentStep === 'upload' && (
          <StepUpload
            onClose={handleCloseButtonClick}
            onNext={handleFilesSelected}
            hasDraft={hasDraft()}
            error={error}
            setError={setError}
          />
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
            initialAspectRatio={currentSettings.aspectRatio}
            initialZoom={currentSettings.zoom}
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
            aspectRatio={currentSettings.aspectRatio}
            zoom={currentSettings.zoom}
            initialFilter={currentSettings.filter}
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
