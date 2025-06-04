import { toast } from 'react-toastify'
import { useState } from 'react'

import { createPostFlow } from '@/features/post/ui/createPost/hooks/postFlow'
import { CreateItemModal } from '@/features/imageFlow/ui/createItemModal/CreateItemModal'
import { MESSAGES } from '@/shared/config/messages'
import { UserProfile } from '@/features/profile/api/profileApi.types'

import { ECreatePostCloseModal } from '../CreatePost'
import { ClosePostModal } from '../closeModal/ClosePostModal'
import { usePostContext, PostContextProvider } from '../providers/PostContext'

type CreatePostModalProps = {
  open: boolean
  onClose: (createPostCloseModal?: ECreatePostCloseModal) => void
  user: Pick<UserProfile, 'userName' | 'avatars' | 'id'>
}

const CreatePostModalContent = ({ open, onClose, user }: CreatePostModalProps) => {
  const { images, publishPost, addImage, description, clearAll } = usePostContext()
  const [isPublishing, setIsPublishing] = useState(false)
  const [showCloseModal, setShowCloseModal] = useState(false)

  const postFlow = createPostFlow()

  const handlePublishPost = async () => {
    setIsPublishing(true)
    try {
      await publishPost()
      toast.success(MESSAGES.POST.POST_PUBLISHED)
      onClose(ECreatePostCloseModal.redirectToProfile)
    } catch (error) {
      toast.error('Failed to publish post')
      console.error('Publish error:', error)
    } finally {
      setIsPublishing(false)
    }
  }

  const handleAddImage = (files: File[]) => {
    addImage(files)
  }

  const handleModalClose = () => {
    if (!hasUnsavedChanges()) {
      onClose(ECreatePostCloseModal.default)
      return
    }

    setShowCloseModal(true)
  }

  const handleCloseConfirm = (saveDraft: boolean) => {
    setShowCloseModal(false)

    if (saveDraft) {
      toast.info(MESSAGES.POST.POST_DRAFT)
      onClose(ECreatePostCloseModal.redirectToHome)
    } else {
      clearAll()
      toast.info(MESSAGES.POST.POST_DISCARDED)
      onClose(ECreatePostCloseModal.default)
    }
  }

  const handleCloseModalCancel = () => {
    setShowCloseModal(false)
  }

  const hasUnsavedChanges = () => images.length > 0

  const stepProps = {
    upload: {
      onFilesSelected: handleAddImage,
      placeholder: 'Drag and drop your image here or click to browse',
      dragPlaceholder: 'Drop the image here',
      primaryButtonText: 'Select from Computer',
      showDraftButton: true,
      draftButtonText: 'Open Draft',
      onDraftClick: () => {
        toast.info('Opening draft will be implemented in the real project.')
      },
    },
    crop: {
      onNavigateBack: clearAll,
    },
    filter: {
      onNavigateBack: () => {},
    },
    description: {
      user,
      disabled: isPublishing,
      onNavigateBack: () => {},
      getValidationState: () => ({
        isValid: description?.length > 0,
        isProcessing: isPublishing,
      }),
    },
  }

  return (
    <>
      <CreateItemModal
        open={open}
        onClose={handleModalClose}
        flow={postFlow}
        initialStep="upload"
        onComplete={handlePublishPost}
        useBuiltInConfirmModal={false}
        hasUnsavedChanges={hasUnsavedChanges}
        stepProps={stepProps}
      />

      <ClosePostModal open={showCloseModal} onClose={handleCloseModalCancel} onConfirm={handleCloseConfirm} />
    </>
  )
}

export const CreatePostModal = (props: CreatePostModalProps) => {
  return (
    <PostContextProvider userId={props.user.id}>
      <CreatePostModalContent {...props} />
    </PostContextProvider>
  )
}
