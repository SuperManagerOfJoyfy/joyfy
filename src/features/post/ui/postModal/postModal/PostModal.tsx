import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { HiDotsHorizontal } from 'react-icons/hi'

import { DropdownMenu, Modal, Scroll, Separator, UserCard } from '@/shared/ui'
import { ImageSlider } from '@/shared/ui/imageSlider'
import { PostActions, PostItem } from '@/features/post/ui/postModal'
import { PostDropdownMenuItems, usePostDropdownMenuActions } from '@/features/post/ui/postModal/postDropdownMenuItems'
import s from './PostModal.module.scss'
import { useGetMeQuery } from '@/features/auth/api/authApi'
import { ConfirmModal } from '@/shared/ui/confirmModal/ConfirmModal'
import { useState } from 'react'
import { useGetPostByIdQuery } from '@/features/post/api/postsApi'
import { useSearchParams } from 'next/navigation'

type Props = {
  open: boolean
  onClose: () => void
}

export const PostModal = ({ open, onClose }: Props) => {
  const [isOpen, setIsOpen] = useState(false) // For confirmation modal
  const { data: user } = useGetMeQuery()

  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())
  const postIdParam = params.get('postId')
  const postId = Number(postIdParam)

  const { data: post } = useGetPostByIdQuery({ postId })

  if (!post) return null

  const isOwnPost = post.ownerId === user?.userId

  // To add condition:
  const isFollowing = false

  const { ownerId, userName, avatarOwner, description, createdAt, likesCount, images } = post

  const { handleEdit, handleDelete, handleFollowToggle, handleCopyLink } = usePostDropdownMenuActions({
    postId,
    ownerId,
    isFollowing,
  })

  async function handleDeletePost() {
    try {
      await handleDelete()
      onClose()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Modal open={open} size="lg" cardPadding="none" className={s.modal} onOpenChange={onClose}>
        <VisuallyHidden>
          <DialogTitle>User post</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </VisuallyHidden>
        <div className={s.container}>
          <div className={s.imageWrapper}>
            <ImageSlider images={images.map((img, idx) => ({ src: img.url, alt: `Post image ${idx + 1}` }))} />
          </div>

          <div className={s.contentWrapper}>
            <div className={s.contentHeader}>
              <UserCard user={{ id: ownerId, userName, avatar: avatarOwner }} />
              <DropdownMenu trigger={<HiDotsHorizontal />}>
                <PostDropdownMenuItems
                  isOwnPost={isOwnPost}
                  isFollowing={isFollowing}
                  onEdit={handleEdit}
                  onDelete={() => setIsOpen(true)}
                  onFollowToggle={handleFollowToggle}
                  onCopyLink={handleCopyLink}
                />
              </DropdownMenu>
            </div>
            <Separator />
            <Scroll className={s.scrollArea}>
              <PostItem item={post} />
            </Scroll>
            <Separator />
            <PostActions likesCount={likesCount} postId={postId} date={createdAt} />
          </div>
        </div>
      </Modal>

      <ConfirmModal
        title={'Delete Post'}
        description={'Are you sure you want to delete this post?'}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onConfirm={handleDeletePost}
      />
    </>
  )
}
