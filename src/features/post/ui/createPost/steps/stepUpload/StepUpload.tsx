'use client'

import { useCallback } from 'react'
import { toast } from 'react-toastify'

import { ACCEPTED_TYPES, MAX_FILE_SIZE_MB, MAX_IMAGES } from '@/features/post/utils/constats'
import { FullImageUpload } from './fullImageUpload/FullImageUpload'
import { FlowType } from '@/features/post/ui/createPost/createPostModal'
import { IoImageOutline } from 'react-icons/io5'

type StepUploadProps = {
  onNext: (files: File[]) => void
  customPlaceholder?: string
  customDragPlaceholder?: string
  flowType?: FlowType
}

export const StepUpload = ({ onNext, customPlaceholder, customDragPlaceholder, flowType }: StepUploadProps) => {
  const handleDraftClick = useCallback(() => {
    toast.info('Draft functionality is limited. Files would need to be stored on the server to be restored.')
  }, [])

  return (
    <div>
      <FullImageUpload
        onFilesSelected={onNext}
        showDraftButton={flowType === 'avatar' ? false : true}
        onDraftClick={handleDraftClick}
        maxFileSize={MAX_FILE_SIZE_MB}
        maxImages={MAX_IMAGES}
        acceptedTypes={ACCEPTED_TYPES}
        placeholder={flowType === 'avatar' ? '' : customPlaceholder}
        dragPlaceholder={customDragPlaceholder}
        icon={flowType === 'avatar' && <IoImageOutline size={50} />}
      />
    </div>
  )
}
