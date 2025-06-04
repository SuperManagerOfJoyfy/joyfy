import { useState, useEffect } from 'react'
import { IoImageOutline } from 'react-icons/io5'

import { createAvatarFlow } from '@/features/profile/ui/profilePhoto/hooks/avatarFlow'
import { CreateItemModal } from '@/features/imageFlow/ui/createItemModal/CreateItemModal'
import { ACCEPTED_TYPES, MAX_FILE_SIZE_MB, MAX_IMAGES } from '@/features/profile/utils'

type AvatarModalProps = {
  open: boolean
  onClose: () => void
}

export const AvatarModal = ({ open, onClose }: AvatarModalProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [modalResetKey, setModalResetKey] = useState(0)

  const avatarFlow = createAvatarFlow()

  const handleFilesSelected = (files: File[]) => {
    const selectedFile = files[0]
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage)
    }
    const imageUrl = URL.createObjectURL(selectedFile)
    setSelectedImage(imageUrl)
  }

  const handleComplete = () => {
    handleClose()
  }

  const handleClose = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage)
    }
    setSelectedImage(null)
    // Force modal to re-render and reset to initial step
    setModalResetKey((prev) => prev + 1)
    onClose()
  }

  // Reset state when modal opens
  useEffect(() => {
    if (open && selectedImage) {
      // Clean up any existing image URL
      URL.revokeObjectURL(selectedImage)
      setSelectedImage(null)
      setModalResetKey((prev) => prev + 1)
    }
  }, [open])

  const hasUnsavedChanges = () => selectedImage !== null

  const stepProps = {
    'avatar-upload': {
      onFilesSelected: handleFilesSelected,
      placeholder: '',
      dragPlaceholder: 'Drop your profile photo here',
      primaryButtonText: 'Select Photo',
      icon: <IoImageOutline size={50} />,
      maxImages: MAX_IMAGES,
      acceptedTypes: ACCEPTED_TYPES,
      maxFileSize: MAX_FILE_SIZE_MB,
      showDraftButton: false,
      largeBottomPadding: true,
    },
    'avatar-position': {
      imageSrc: selectedImage,
      onUpload: handleComplete,
    },
  }

  return (
    <CreateItemModal
      key={modalResetKey}
      open={open}
      onClose={handleClose}
      flow={avatarFlow}
      initialStep="avatar-upload"
      onComplete={handleComplete}
      hasUnsavedChanges={hasUnsavedChanges}
      stepProps={stepProps}
      confirmModalConfig={{
        title: 'Close',
        description: 'Are you sure you want to exit without saving changes?',
      }}
    />
  )
}
