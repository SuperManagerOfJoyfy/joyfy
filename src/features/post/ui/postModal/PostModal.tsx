'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useAppDispatch } from '@/app/store/store'
import { useGetMeQuery } from '@/features/auth/api/authApi'
import { postsApi, useGetPostByIdQuery } from '@/features/post/api/postsApi'
import { Post } from '@/features/post/types/types'
import { EditPostForm, PostContent, usePostDropdownMenuActions } from '@/features/post/ui/postModal'
import { ConfirmModal, ImageSlider, Modal } from '@/shared/ui'
import s from './PostModal.module.scss'

type Props = {
  initialPost: Post
}

type ConfirmAction = 'delete' | 'cancelEdit' | null

export const PostModal = ({ initialPost }: Props) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const params = useParams()
  const postId = Number(params?.postId)

  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [hasFormChanges, setHasFormChanges] = useState(false)

  const { data: user } = useGetMeQuery()
  const { data: post, refetch } = useGetPostByIdQuery(postId, { skip: !postId, refetchOnMountOrArgChange: false })

  const currentPost = post || initialPost

  useEffect(() => {
    if (initialPost) {
      dispatch(postsApi.util.upsertQueryData('getPostById', initialPost.id, initialPost))
    }
  }, [dispatch, initialPost])

  const dismissModal = () => {
    router.back()
  }

  // To add condition:
  const isFollowing = false

  const { handleEdit, handleDelete, handleFollowToggle, handleCopyLink } = usePostDropdownMenuActions({
    userId: user?.userId || 0,
    postId: postId || 0,
    ownerId: currentPost?.ownerId ?? 0,
    isFollowing,
    setIsEditing,
  })

  const { userName, ownerId, avatarOwner, description, images } = currentPost

  const isOwnPost = ownerId === user?.userId

  const handleDeletePost = async () => {
    await handleDelete()
    dismissModal()
  }

  const handleModalClose = () => {
    if (isEditing && hasFormChanges) {
      setConfirmAction('cancelEdit')
    } else {
      dismissModal()
    }
  }

  const handleEditSave = async () => {
    await refetch()

    setIsEditing(false)
    setHasFormChanges(false)
  }

  const handleEditCancel = () => {
    if (hasFormChanges) {
      setConfirmAction('cancelEdit')
    } else {
      setIsEditing(false)
    }
  }

  const handleConfirmAction = async () => {
    if (confirmAction === 'delete') {
      await handleDeletePost()
    } else if (confirmAction === 'cancelEdit') {
      setIsEditing(false)
      setHasFormChanges(false)
    }
    setConfirmAction(null)
  }

  return (
    <>
      <Modal
        open={!!initialPost}
        size="lg"
        cardPadding="none"
        className={s.modal}
        onOpenChange={handleModalClose}
        title={isEditing ? 'Edit Post' : undefined}
        header="custom"
      >
        <VisuallyHidden>
          <DialogTitle>{`${userName} post`}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </VisuallyHidden>
        <div className={s.container}>
          <div className={s.imageWrapper}>
            <ImageSlider images={images.map((img, idx) => ({ src: img.url, alt: `Post image ${idx + 1}` }))} />
          </div>
          <div className={s.contentWrapper}>
            {isEditing ? (
              <EditPostForm
                user={{ id: ownerId, userName, avatar: avatarOwner }}
                defaultDescription={description}
                postId={postId}
                onCancelEdit={handleEditCancel}
                onSaveEdit={handleEditSave}
                onFormChange={setHasFormChanges}
              />
            ) : (
              <PostContent
                post={currentPost}
                onEdit={handleEdit}
                onDelete={() => setConfirmAction('delete')}
                isOwnPost={isOwnPost}
                isFollowing={isFollowing}
                onFollowToggle={handleFollowToggle}
                onCopyLink={handleCopyLink}
              />
            )}
          </div>
        </div>
      </Modal>

      <ConfirmModal
        title={confirmAction === 'delete' ? 'Delete Post' : 'Cancel Editing'}
        description={
          confirmAction === 'delete'
            ? 'Are you sure you want to delete this post?'
            : 'Are you sure you want to exit post editing? Your changes will not be saved.'
        }
        isOpen={!!confirmAction}
        setIsOpen={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
      />
    </>
  )
}
