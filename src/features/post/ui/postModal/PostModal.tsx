'use client'

import { PostModalContextProvider, usePostModalContext } from '@/features/post/context'
import { Post } from '@/features/post/types/postTypes'
import { ConfirmationModal, PostModalLayout } from '@/features/post/ui/postModal'
import { Modal } from '@/shared/ui'
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

type Props = {
  initialPost: Post
  userId: number
}

export const PostModal = ({ initialPost, userId }: Props) => {
  return (
    <PostModalContextProvider initialPost={initialPost} userId={userId}>
      <ModalContent />
      <ConfirmationModal />
    </PostModalContextProvider>
  )
}

const ModalContent = () => {
  const { isEditing, currentPost, handleModalClose } = usePostModalContext()

  const { userName, description } = currentPost

  return (
    <Modal
      open={!!currentPost}
      size="lg"
      cardPadding="none"
      onOpenChange={handleModalClose}
      title={isEditing ? 'Edit Post' : undefined}
      header="custom"
    >
      <VisuallyHidden>
        <DialogTitle>{`${userName} post`}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </VisuallyHidden>

      <PostModalLayout />
    </Modal>
  )
}
