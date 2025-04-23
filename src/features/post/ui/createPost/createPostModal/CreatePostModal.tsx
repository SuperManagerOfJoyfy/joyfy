'use client'

import { useState } from 'react'
import { Modal } from '@/shared/ui/modal'
import { StepUpload } from '../stepUpload/StepUpload'
import { StepCrop } from '../stepCrop/StepCrop'
import { StepDescription } from '../stepDescription/StepDescription'
import {
  AspectRatioType,
  FilterType,
  PostCreationStep,
} from '@/features/post/types/types'
import { StepFilters } from '../stepFilters/StepFilters'
import { ClosePostModal } from '../closeModal/ClosePostModal'

type Props = {
  open: boolean
  onClose: () => void
  onPublish: (formData: FormData) => void
}

export const CreatePostModal = ({ open, onClose, onPublish }: Props) => {
  const [currentStep, setCurrentStep] = useState<PostCreationStep>('upload')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('1:1')
  const [zoom, setZoom] = useState(1)
  const [filter, setFilter] = useState<FilterType>('Normal')
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false)

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

  const handleCropComplete = (
    files: File[],
    ratio: AspectRatioType,
    zoomLevel: number
  ) => {
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
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append(`image${index}`, file)
    })
    formData.append('description', description)
    formData.append('aspectRatio', aspectRatio)
    formData.append('filter', filter)
    formData.append('zoom', zoom.toString())
    onPublish(formData)
  }

  const handleConfirmClose = (saveDraft: boolean) => {
    if (saveDraft) {
      const draft = {
        files: selectedFiles,
        aspectRatio,
        filter,
        zoom,
      }
      localStorage.setItem('postDraft', JSON.stringify(draft))
    }

    setIsCloseModalOpen(false)
    onClose()
  }

  const getModalTitle = () => {
    switch (currentStep) {
      case 'upload':
        return 'Add Photo'
      case 'crop':
        return 'Crop'
      case 'filter':
        return 'Filters'
      case 'description':
        return 'Publication'
      default:
        return 'Add Photo'
    }
  }

  return (
    <>
      <Modal
        open={open}
        onOpenChange={handleCloseButtonClick}
        title={getModalTitle()}
        size={currentStep === 'filter' ? 'lg' : 'md'}
      >
        {currentStep === 'upload' && (
          <StepUpload
            onClose={handleCloseButtonClick}
            onNext={handleFilesSelected}
          />
        )}
        {currentStep === 'crop' && (
          <StepCrop
            files={selectedFiles}
            onBack={() => setCurrentStep('upload')}
            onNext={handleCropComplete}
          />
        )}
        {currentStep === 'filter' && (
          <StepFilters
            files={selectedFiles}
            aspectRatio={aspectRatio}
            zoom={zoom}
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
