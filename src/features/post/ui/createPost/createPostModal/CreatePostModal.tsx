'use client'

import { useState } from 'react'
import ReactDOM from 'react-dom'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

import { Modal } from '@/shared/ui/modal'
import { PostCreationStep } from '@/features/post/types/types'
import { PostContextProvider, usePostContext } from '../providers/PostContext'
import { StepCrop, StepDescription, StepFilters, StepUpload } from '../steps'
import { ClosePostModal } from '../closeModal/ClosePostModal'
import { getCardPadding, getModalSize, getModalTitle } from '../utils/modalStepUtils'
import { LeftButton, RightButton } from '../navigationButtons/NavigationButtons'
import { useGetMeQuery } from '@/features/auth/api/authApi'
import { UserProfileProps } from '@/features/profile/ui/userProfile'

type CreatePostModalProps = {
  open: boolean
  onClose: () => void
  user: Pick<UserProfileProps, 'userName' | 'avatars' | 'id'>
}

const PostModalContent = ({ open, onClose, user }: CreatePostModalProps) => {
  const { addImage, images, publishPost } = usePostContext()
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState<PostCreationStep>('upload')
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  const handleMainModalOpenChange = (newOpen: boolean) => {
    if (!newOpen) handleCloseButtonClick()
  }

  const handleCloseButtonClick = () => {
    if (images.length > 0) {
      setIsCloseModalOpen(true)
    } else {
      onClose()
    }
  }

  const handleFilesSelected = (files: File[]) => {
    addImage(files)
    setCurrentStep('crop')
  }

  const handleBack = (step: PostCreationStep): PostCreationStep => {
    switch (step) {
      case 'filter':
        return 'crop'
      case 'description':
        return 'filter'
      default:
        return 'upload'
    }
  }

  const handleNextClick = async () => {
    switch (currentStep) {
      case 'crop':
        setCurrentStep('filter')
        break
      case 'filter':
        setCurrentStep('description')
        break
      case 'description':
        setIsPublishing(true)
        try {
          await publishPost()
          toast.success('Post successfully published!')
          router.push(`/profile/${user?.id || ''}`)
        } finally {
          setIsPublishing(false)
          onClose()
        }
        break
    }
  }

  const handleConfirmClose = (saveDraft: boolean) => {
    setIsCloseModalOpen(false)

    if (saveDraft) {
      toast.info('Draft saved')
      onClose()
      router.push('/')
    } else {
      toast.info('Draft discarded')
    }
  }

  const isButtonDisabled = currentStep === 'description' && isPublishing

  return (
    <>
      <Modal
        open={open}
        onOpenChange={handleMainModalOpenChange}
        title={getModalTitle(currentStep)}
        size={getModalSize(currentStep)}
        cardPadding={getCardPadding(currentStep)}
        leftButton={
          <LeftButton
            currentStep={currentStep}
            onBack={() => setCurrentStep(handleBack(currentStep))}
            disabled={isButtonDisabled}
          />
        }
        rightButton={
          <RightButton
            currentStep={currentStep}
            onClose={handleCloseButtonClick}
            onNext={handleNextClick}
            isCreating={isPublishing}
            isUploading={isPublishing}
            disabled={isButtonDisabled}
          />
        }
      >
        {currentStep === 'upload' && <StepUpload onNext={handleFilesSelected} />}
        {currentStep === 'crop' && <StepCrop onNavigateBack={() => setCurrentStep('upload')} />}
        {currentStep === 'filter' && <StepFilters />}
        {currentStep === 'description' && <StepDescription disabled={isPublishing} user={user} />}
      </Modal>

      {isCloseModalOpen &&
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

export const CreatePostModal = (props: CreatePostModalProps) => {
  return (
    <PostContextProvider>
      <PostModalContent {...props} />
    </PostContextProvider>
  )
}
