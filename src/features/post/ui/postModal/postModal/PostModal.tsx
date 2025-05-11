import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { HiDotsHorizontal } from 'react-icons/hi'

import { DropdownMenu, Modal, Scroll, Separator, UserCard } from '@/shared/ui'
import { ImageSlider } from '@/shared/ui/imageSlider'
import { PostActions, PostItem } from '@/features/post/ui/postModal'
import { usePostDropdownMenuActions } from '@/features/post/ui/postModal/postDropdownMenuItems'
import { PostDropdownMenuItems } from '@/features/post/ui/postModal/postDropdownMenuItems'
import { PostItem as PostItemType } from '@/features/post/types/types'
import s from './PostModal.module.scss'
import { useGetMeQuery } from '@/features/auth/api/authApi'

type Props = {
  post: PostItemType
  open: boolean
  onClose: () => void
}

export const PostModal = ({ post, open, onClose }: Props) => {
  const { data: user } = useGetMeQuery()

  const { userName, ownerId, avatarOwner, description, likesCount, id: postId, createdAt, images } = post

  const isOwnPost = ownerId === user?.userId

  // To add condition:
  const isFollowing = false

  const { handleEdit, handleDelete, handleFollowToggle, handleCopyLink } = usePostDropdownMenuActions({
    postId,
    ownerId,
    isFollowing,
  })

  if (!post) return null
  return (
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
                onDelete={handleDelete}
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
  )
}
