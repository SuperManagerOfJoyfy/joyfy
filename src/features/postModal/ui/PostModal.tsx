'use client'

import { Post } from '@/features/post/types/postTypes'

import { PostModalContextProvider, usePostModalContext } from '../context/PostModalContext'
import { PostModalBody } from './PostModalBody'
import { Modal } from '@/shared/ui'

import { PostModalHeaderMeta } from '../postViewMode'
import { PostModalImageSlider } from './PostModalImageSlider'
import { ConfirmationModal } from '../shared'
import s from './PostModal.module.scss'
import { useTranslations } from 'next-intl'

export type UserProfileType = { userId: number; userName: string }

type Props = {
  initialPost: Post
  userProfile: UserProfileType
  manageUrl?: boolean
  onClose?: () => void
}

export const PostModal = ({ initialPost, userProfile, manageUrl, onClose }: Props) => {
  return (
    <PostModalContextProvider
      initialPost={initialPost}
      userProfile={userProfile}
      manageUrl={manageUrl}
      onClose={onClose}
    >
      <PostModalLayout />
    </PostModalContextProvider>
  )
}

const PostModalLayout = () => {
  const t = useTranslations('postModal')

  const { isEditing, currentPost, handleModalClose } = usePostModalContext()
  const isOpen = !!currentPost

  return (
    <>
      <Modal
        open={isOpen}
        size="lg"
        cardPadding="none"
        onOpenChange={handleModalClose}
        title={isEditing ? t('editTitle') : undefined}
        header="custom"
      >
        <PostModalHeaderMeta />

        <div className={s.container}>
          <PostModalImageSlider />
          <PostModalBody />
        </div>
      </Modal>
      <ConfirmationModal />
    </>
  )
}
