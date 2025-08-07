import { useState, useCallback } from 'react'
import { toast } from 'react-toastify'

import { createPostFlow, Step } from '@/features/post/ui/createPost/hooks/postFlow'
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
  const {
    images,
    publishPost,
    addImage,
    description,
    clearAll,
    saveDraft,
    loadDraft,
    deleteDraft,
    hasDraft,
    isDraftLoading,
  } = usePostContext()

  const [isPublishing, setIsPublishing] = useState(false)
  const [showCloseModal, setShowCloseModal] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [isLoadingDraft, setIsLoadingDraft] = useState(false)
  const [modalKey, setModalKey] = useState(0)

  const postFlow = createPostFlow()

  const hasUnsavedChanges = useCallback(() => {
    return images.length > 0 || description.trim().length > 0
  }, [images.length, description])

  const getInitialStep = useCallback((): Step => {
    return images.length > 0 ? 'crop' : 'upload'
  }, [images.length])

  const handlePublishPost = async () => {
    setIsPublishing(true)
    try {
      await publishPost()
      toast.success(MESSAGES.POST.POST_PUBLISHED)
      onClose(ECreatePostCloseModal.redirectToProfile)
    } catch (error) {
    } finally {
      setIsPublishing(false)
    }
  }

  const handleLoadDraft = async () => {
    if (isDraftLoading || isLoadingDraft) return

    setIsLoadingDraft(true)
    try {
      await loadDraft()
      setModalKey((prev) => prev + 1)
    } finally {
      setIsLoadingDraft(false)
    }
  }

  const handleModalClose = useCallback(() => {
    hasUnsavedChanges() ? setShowCloseModal(true) : handleImmediateClose()
  }, [hasUnsavedChanges])

  const handleImmediateClose = useCallback(() => {
    onClose(ECreatePostCloseModal.default)
  }, [onClose])

  const handleCloseModalCancel = useCallback(() => {
    setShowCloseModal(false)
  }, [])

  const handleCloseConfirm = async (saveDraftOption: boolean) => {
    setShowCloseModal(false)

    if (saveDraftOption) {
      setIsSavingDraft(true)
      try {
        await saveDraft()
        toast.success(MESSAGES.POST.POST_DRAFT)
        onClose(ECreatePostCloseModal.redirectToHome)
      } finally {
        setIsSavingDraft(false)
      }
    } else {
      try {
        if (hasDraft) await deleteDraft()
        clearAll()
        toast.info(MESSAGES.POST.POST_DISCARDED)
      } finally {
        onClose(ECreatePostCloseModal.default)
      }
    }
  }

  const stepProps = {
    upload: {
      onFilesSelected: addImage,
      placeholder: 'Drag and drop your image here or click to browse',
      dragPlaceholder: 'Drop the image here',
      primaryButtonText: 'Select from Computer',
      showDraftButton: hasDraft && images.length === 0,
      draftButtonText: isLoadingDraft ? 'Loading Draft...' : 'Open Draft',
      onDraftClick: handleLoadDraft,
      draftButtonDisabled: isDraftLoading || isLoadingDraft,
    },
    description: {
      user,
      disabled: isPublishing,
      getValidationState: () => ({
        isValid: description?.trim().length > 0,
        isProcessing: isPublishing,
      }),
    },
  }

  return (
    <>
      <CreateItemModal
        key={modalKey}
        open={open}
        onClose={handleModalClose}
        flow={postFlow}
        initialStep={getInitialStep()}
        onComplete={handlePublishPost}
        useBuiltInConfirmModal={false}
        hasUnsavedChanges={hasUnsavedChanges}
        stepProps={stepProps}
      />
      <ClosePostModal
        open={showCloseModal}
        onClose={handleCloseModalCancel}
        onConfirm={handleCloseConfirm}
        hasContent={hasUnsavedChanges()}
        isSaving={isSavingDraft}
      />
    </>
  )
}

export const CreatePostModal = (props: CreatePostModalProps) => (
  <PostContextProvider userId={props.user.id}>
    <CreatePostModalContent {...props} />
  </PostContextProvider>
)
