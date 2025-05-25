import s from './publicPostModal.module.scss'
import { AvatarGroup, ImageSlider, Modal, Scroll, Separator, Typography, UserCard } from '@/shared/ui'
import { Post } from '@/features/post/types/types'
import { PostItem } from '@/features/post/ui/postModal'

type Props = {
  open: boolean
  closeModal: () => void
  post: Post | null
}

export const PublicPostModal = ({ open, closeModal, post }: Props) => {
  if (!post) return null

  const { userName, avatarOwner: avatar, images, id, likesCount, createdAt, avatarWhoLikes } = post

  const arrayOfAvatars = typeof avatarWhoLikes !== 'boolean' ? avatarWhoLikes : []

  return (
    <Modal open={open} onOpenChange={closeModal} header="custom" size="lg" cardPadding="none">
      <div className={s.container}>
        <div className={s.imageWrapper}>
          <ImageSlider images={images.map(({ url }, index) => ({ src: url, alt: `Post image ${index + 1}` }))} />
        </div>

        <div className={s.contentWrapper}>
          <div className={s.header}>
            <UserCard user={{ id, userName, avatar }} />
          </div>

          <Separator />

          <Scroll className={s.scroll}>
            <PostItem item={post} />
          </Scroll>

          <Separator />

          <div className={s.footer}>
            {likesCount > 0 && (
              <div className={s.likes}>
                <AvatarGroup avatars={arrayOfAvatars} />

                <Typography variant={'body2'}>
                  {likesCount} <b>"Like"</b>
                </Typography>
              </div>
            )}

            <Typography variant={'caption'} className={s.data}>
              {new Date(createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </div>
        </div>
      </div>
    </Modal>
  )
}
