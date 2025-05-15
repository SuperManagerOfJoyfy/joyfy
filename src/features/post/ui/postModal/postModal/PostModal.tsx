'use client'

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
import { useDeletePostMutation } from '@/features/post/api/postsApi'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'
import { Post } from '@/features/post/types/types'

type Props = {
  post: Post
}

export const PostModal = ({ post }: Props) => {
  const { ownerId, userName, avatarOwner, description, createdAt, likesCount, images } = post

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [deletePost] = useDeletePostMutation()
  const { data: user } = useGetMeQuery()
  const router = useRouter()
  const searchParams = useSearchParams()
  const postIdParam = searchParams.get('postId')
  const postId = Number(postIdParam)

  if (!post) return null

  const isOwnPost = post?.ownerId === user?.userId
  const isFollowing = false

  const closeModalHandler = () => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete('postId')
    router.push(`?${newParams.toString()}`)
  }

  async function handleDeletePost() {
    try {
      await deletePost({ postId })
      toast.success('Post deleted successfully.')
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      closeModalHandler()
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
      <Modal open={true} size="lg" cardPadding="none" className={s.modal} onOpenChange={closeModalHandler}>
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
                  onDelete={() => setIsConfirmationModalOpen(true)}
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
        isOpen={isConfirmationModalOpen}
        setIsOpen={setIsConfirmationModalOpen}
        onConfirm={handleDeletePost}
      />
    </>
  )
}
