import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { HiDotsHorizontal } from 'react-icons/hi'

import { DropdownMenu, Modal, Scroll, Separator, UserCard } from '@/shared/ui'
import { ImageSlider } from '@/shared/ui/imageSlider'
import { PostActions, PostItem } from '@/features/post/ui/postModal'
import { PostDropdownMenuItems } from '@/features/post/ui/postModal/postDropdownMenuItems'
import s from './PostModal.module.scss'
import { useGetMeQuery } from '@/features/auth/api/authApi'
import { ConfirmModal } from '@/shared/ui/confirmModal/ConfirmModal'
import { useState } from 'react'
import { useDeletePostMutation, useGetPostByIdQuery } from '@/features/post/api/postsApi'
import { useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'

type Props = {
  open: boolean
  onClose: () => void
}

export const PostModal = ({ open, onClose }: Props) => {
  const [isOpen, setIsOpen] = useState(false) // For confirmation modal
  const [deletePost] = useDeletePostMutation()
  const { data: user } = useGetMeQuery()

  const searchParams = useSearchParams()
  const postIdParam = searchParams.get('postId')
  const postId = Number(postIdParam)

  const { data: post } = useGetPostByIdQuery({ postId })

  if (!post) return null

  const { ownerId, userName, avatarOwner, description, createdAt, likesCount, images } = post

  const isOwnPost = post?.ownerId === user?.userId
  const isFollowing = false

  async function handleDeletePost() {
    try {
      await deletePost({ postId })
      toast.success('Post deleted successfully.')
      onClose()
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const handleEdit = () => {
    console.log('edit')
  }

  const handleFollowToggle = () => {
    if (isFollowing) {
      console.log('Unfollow')
    } else {
      console.log('Follow')
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`)
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
