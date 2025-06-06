'use client'

import { useCallback } from 'react'
import { toast } from 'react-toastify'

import { ACCEPTED_TYPES, MAX_FILE_SIZE_MB, MAX_IMAGES } from '@/features/post/utils/constats'
import { FullImageUpload } from '../../../../../imageFlow/ui/fullImageUpload/FullImageUpload'

type StepUploadProps = {
  onNext: (files: File[]) => void
  customPlaceholder?: string
  customDragPlaceholder?: string
}

export const StepUpload = ({ onNext, customPlaceholder, customDragPlaceholder }: StepUploadProps) => {
  const handleDraftClick = useCallback(() => {
    toast.info('Draft functionality is limited. Files would need to be stored on the server to be restored.')
  }, [])

  return (
    <div>
      <FullImageUpload
        onFilesSelected={onNext}
        showDraftButton={true}
        onDraftClick={handleDraftClick}
        maxFileSize={MAX_FILE_SIZE_MB}
        maxImages={MAX_IMAGES}
        acceptedTypes={ACCEPTED_TYPES}
        placeholder={customPlaceholder}
        dragPlaceholder={customDragPlaceholder}
      />
    </div>
  )
}
