'use client'

import { useState } from 'react'
import ReactDOM from 'react-dom'
import { toast } from 'react-toastify'

import { Modal } from '@/shared/ui/modal'
import { PostCreationStep } from '@/features/post/types/types'
import { UserProfile } from '@/features/profile/api/profileApi.types'

import { PostContextProvider, usePostContext } from '../providers/PostContext'
import { StepCrop, StepDescription, StepFilters, StepUpload } from '../steps'
import { ClosePostModal } from '../closeModal/ClosePostModal'
import { getCardPadding, getModalSize, getModalTitle } from '../utils/modalStepUtils'
import { LeftButton, RightButton } from '../createNavigationButtons/CeateNavigationButtons'
import { ECreatePostCloseModal } from '../CreatePost'

type CreatePostModalProps = {
  open: boolean
  onClose: (createPostCloseModal?: ECreatePostCloseModal) => void
  user: Pick<UserProfile, 'userName' | 'avatars' | 'id'>
}

const PostModalContent = ({ open, onClose, user }: CreatePostModalProps) => {
  const { addImage, images, publishPost, clearAll, description } = usePostContext()

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
      onClose(ECreatePostCloseModal.default)
    }
  }

  const handleFilesSelected = (files: File[]) => {
    addImage(files)
    setCurrentStep('crop')
  }

  const handleBack = (step: PostCreationStep) => {
    switch (step) {
      case 'filter':
        setCurrentStep('crop')
        break
      case 'description':
        setCurrentStep('filter')
        break
      default:
        clearAll()
        setCurrentStep('upload')
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
          onClose(ECreatePostCloseModal.redirectToProfile)
        } finally {
          setIsPublishing(false)
        }
        break
    }
  }

  const handleConfirmClose = (saveDraft: boolean) => {
    if (saveDraft) {
      toast.info('Draft saved')
      onClose(ECreatePostCloseModal.redirectToHome)
    } else {
      toast.info('Draft discarded')
      onClose(ECreatePostCloseModal.default)
    }
  }

  const isButtonPrevDisabled = currentStep === 'description' && isPublishing
  const isButtonNextDisabled = currentStep === 'description' && (isPublishing || !description.length)

  return (
    <>
      <Modal
        open={open}
        onOpenChange={handleMainModalOpenChange}
        title={getModalTitle(currentStep)}
        size={getModalSize(currentStep)}
        cardPadding={getCardPadding(currentStep)}
        centerTitle={currentStep !== 'upload'}
        leftButton={<LeftButton currentStep={currentStep} onBack={handleBack} disabled={isButtonPrevDisabled} />}
        rightButton={
          <RightButton
            currentStep={currentStep}
            onClose={handleCloseButtonClick}
            onNext={handleNextClick}
            isCreating={isPublishing}
            isUploading={isPublishing}
            disabled={isButtonNextDisabled}
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
