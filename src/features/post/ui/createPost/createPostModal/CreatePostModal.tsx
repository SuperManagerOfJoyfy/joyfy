'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/shared/ui/modal'
import { AspectRatioType, DraftData, FilterType, PostCreationStep, PublishData } from '@/features/post/types/types'
import { StepUpload } from '../stepUpload'
import { StepCrop } from '../stepCrop/StepCrop'
import { StepFilters } from '../stepFilters/StepFilters'
import { StepDescription } from '../stepDescription/StepDescription'
import { ClosePostModal } from '../closeModal/ClosePostModal'

const DRAFT_STORAGE_KEY = 'postDraft'

type CreatePostModalProps = {
  open: boolean
  onClose: () => void
  onPublish: (formData: PublishData) => void
}

export const CreatePostModal = ({ open, onClose, onPublish }: CreatePostModalProps) => {
  const [currentStep, setCurrentStep] = useState<PostCreationStep>('upload')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('1:1')
  const [zoom, setZoom] = useState(1)
  const [filter, setFilter] = useState<FilterType>('Normal')
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false)
  const [hasDraft, setHasDraft] = useState(false)

  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft) as DraftData

        setAspectRatio(parsedDraft.aspectRatio)
        setFilter(parsedDraft.filter)
        setZoom(parsedDraft.zoom)
        setHasDraft(true)
      } catch (error) {
        console.error('Error parsing draft data', error)
        localStorage.removeItem(DRAFT_STORAGE_KEY)
      }
    }
  }, [])

  const handleCloseButtonClick = () => {
    if (currentStep !== 'upload' && selectedFiles.length > 0) {
      setIsCloseModalOpen(true)
    } else {
      onClose()
    }
  }

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files)
    setCurrentStep('crop')
  }

  const handleCropComplete = (files: File[], ratio: AspectRatioType, zoomLevel: number) => {
    setSelectedFiles(files)
    setAspectRatio(ratio)
    setZoom(zoomLevel)
    setCurrentStep('filter')
  }

  const handleFilterComplete = (files: File[], selectedFilter: FilterType) => {
    setSelectedFiles(files)
    setFilter(selectedFilter)
    setCurrentStep('description')
  }

  const handlePublish = (files: File[], description: string) => {
    localStorage.removeItem(DRAFT_STORAGE_KEY)
    setHasDraft(false)

    onPublish({
      files,
      description,
      aspectRatio,
      filter,
      zoom,
    })
  }

  const handleConfirmClose = (saveDraft: boolean) => {
    if (saveDraft && selectedFiles.length > 0) {
      const draft: DraftData = {
        aspectRatio,
        filter,
        zoom,
        timestamp: Date.now(),
      }
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft))
    } else {
      localStorage.removeItem(DRAFT_STORAGE_KEY)
      setHasDraft(false)
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
    if (currentStep === 'description') return 'md'
    return 'md'
  }

  return (
    <>
      <Modal open={open} onOpenChange={handleCloseButtonClick} title={getModalTitle()} size={getModalSize()}>
        {currentStep === 'upload' && (
          <StepUpload onClose={handleCloseButtonClick} onNext={handleFilesSelected} hasDraft={hasDraft} />
        )}
        {currentStep === 'crop' && (
          <StepCrop
            files={selectedFiles}
            onBack={() => setCurrentStep('upload')}
            onNext={handleCropComplete}
            initialAspectRatio={aspectRatio}
            initialZoom={zoom}
          />
        )}
        {currentStep === 'filter' && (
          <StepFilters
            files={selectedFiles}
            aspectRatio={aspectRatio}
            zoom={zoom}
            initialFilter={filter}
            onBack={() => setCurrentStep('crop')}
            onNext={handleFilterComplete}
          />
        )}
        {currentStep === 'description' && (
          <StepDescription
            files={selectedFiles}
            aspectRatio={aspectRatio}
            zoom={zoom}
            filter={filter}
            onBack={() => setCurrentStep('filter')}
            onPublish={handlePublish}
          />
        )}
      </Modal>

      <ClosePostModal
        open={isCloseModalOpen}
        onClose={() => setIsCloseModalOpen(false)}
        onConfirm={handleConfirmClose}
      />
    </>
  )
}
