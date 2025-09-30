'use client'

import { useState, useEffect } from 'react'
import { IoImageOutline } from 'react-icons/io5'
import { useTranslations } from 'next-intl'

import { createAvatarFlow } from '@/features/profile/ui/profilePhoto/hooks/avatarFlow'
import { CreateItemModal } from '@/features/imageFlow/ui/createItemModal/CreateItemModal'
import { ACCEPTED_TYPES, MAX_FILE_SIZE_MB, MAX_IMAGES } from '@/features/profile/utils'

type AvatarModalProps = {
  open: boolean
  onClose: () => void
}

export const AvatarModal = ({ open, onClose }: AvatarModalProps) => {
  const t = useTranslations()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [modalResetKey, setModalResetKey] = useState(0)

  const avatarFlow = createAvatarFlow(t)

  const handleFilesSelected = (files: File[]) => {
    const file = files[0]
    if (!file) return
    if (selectedImage) URL.revokeObjectURL(selectedImage)
    const url = URL.createObjectURL(file)
    setSelectedImage(url)
  }

  const handleComplete = () => {
    handleClose()
  }

  const handleClose = () => {
    if (selectedImage) URL.revokeObjectURL(selectedImage)
    setSelectedImage(null)
    setModalResetKey((k) => k + 1)
    onClose()
  }

  useEffect(() => {
    if (open && selectedImage) {
      URL.revokeObjectURL(selectedImage)
      setSelectedImage(null)
      setModalResetKey((k) => k + 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const hasUnsavedChanges = () => selectedImage !== null

  const stepProps = {
    'avatar-upload': {
      onFilesSelected: handleFilesSelected,
      placeholder: '',
      dragPlaceholder: t('avatar.upload.dragPlaceholder'),
      primaryButtonText: t('avatar.upload.primaryButton'),
      icon: <IoImageOutline size={50} />,
      maxImages: MAX_IMAGES,
      acceptedTypes: ACCEPTED_TYPES,
      maxFileSize: MAX_FILE_SIZE_MB,
      showDraftButton: false,
      largeBottomPadding: true,
    },
    'avatar-position': {
      imageSrc: selectedImage ?? undefined,
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
        title: t('closePostModal.title'),
        description: t('closePostModal.confirm'),
      }}
    />
  )
}
