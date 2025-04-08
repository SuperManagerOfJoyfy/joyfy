'use client'

import { Modal } from '@/shared/ui/modal'
import { StepUpload } from '../stepUpload/StepUpload'

type Props = {
  open: boolean
  onClose: () => void
  onUploadComplete?: (imageData: File) => void
}

export const CreatePostModal = ({ open, onClose, onUploadComplete }: Props) => {
  return (
    <Modal open={open} onOpenChange={onClose} title="Add Photo" size="md">
      <StepUpload onClose={onClose} onUploadComplete={onUploadComplete} />
    </Modal>
  )
}
