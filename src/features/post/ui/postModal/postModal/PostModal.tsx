'use client'

import { useEffect, useState } from 'react'
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useGetMeQuery } from '@/features/auth/api/authApi'
import { postsApi, useGetPostByIdQuery } from '@/features/post/api/postsApi'
import { ConfirmModal, ImageSlider, Loader, Modal } from '@/shared/ui'
import { EditPostForm, PostContent, usePostDropdownMenuActions } from '@/features/post/ui/postModal'
import s from './PostModal.module.scss'
import { Post } from '@/features/post/types/types'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppDispatch } from '@/app/store/store'

type Props = {
  initialPost: Post
}

type ConfirmAction = 'delete' | 'cancelEdit' | null

export const PostModal = ({ initialPost }: Props) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (initialPost) {
      dispatch(postsApi.util.upsertQueryData('getPostById', initialPost.id, initialPost))
    }
  }, [dispatch, initialPost])

  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)
  const [isEditing, setIsEditing] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const postIdParam = searchParams.get('postId')
  const postId = Number(postIdParam)

  const { data: user } = useGetMeQuery()
  const { data: post, isLoading, refetch } = useGetPostByIdQuery(postId)

  const closeModalHandler = () => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete('postId')
    router.push(`?${newParams.toString()}`)
  }

  // To add condition:
  const isFollowing = false

  const { handleEdit, handleDelete, handleFollowToggle, handleCopyLink } = usePostDropdownMenuActions({
    postId: postId || 0,
    ownerId: post?.ownerId ?? 0,
    isFollowing,
    setIsEditing,
  })

  if (!post) return null

  const { userName, ownerId, avatarOwner, description, likesCount, createdAt, images } = post

  const isOwnPost = ownerId === user?.userId

  async function handleDeletePost() {
    try {
      await handleDelete()
    } catch (error) {
      console.error(error)
    } finally {
      closeModalHandler()
    }
  }

  if (isLoading) return <Loader />

  const handlePostSave = async () => {
    if (post) {
      await refetch()
      setIsEditing(false)
    }
  }

  const handleCloseModal = () => {
    isEditing ? setConfirmAction('cancelEdit') : closeModalHandler()
  }

  const handleConfirmAction = async () => {
    if (confirmAction === 'delete') {
      await handleDeletePost()
    } else if (confirmAction === 'cancelEdit') {
      setIsEditing(false)
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
        onOpenChange={handleCloseModal}
        title={isEditing ? 'Edit Post' : undefined}
        header="custom"
      >
        <VisuallyHidden>
          <DialogTitle>User post</DialogTitle>
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
                onCancel={() => setConfirmAction('cancelEdit')}
                onSave={handlePostSave}
              />
            ) : (
              <PostContent
                post={post}
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
