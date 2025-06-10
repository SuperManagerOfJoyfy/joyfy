import { Post } from '@/features/post/types/postTypes'

import { AvatarGroup, DateStamp, ImageSlider, Modal, Scroll, Separator, Typography } from '@/shared/ui'
import { PostItem } from '@/entities/post/ui/postItem'
import { UserCard } from '@/entities/user'
import s from './publicPostModal.module.scss'

type Props = {
  open: boolean
  closeModal: () => void
  post: Post | null
}

export const PublicPostModal = ({ open, closeModal, post }: Props) => {
  if (!post) return null

  const { userName, avatarOwner: avatar, images, ownerId, likesCount, createdAt, avatarWhoLikes } = post

  // TODO: make postLikes query and feed AvatarGroup component with data from this query
  const arrayOfAvatars = typeof avatarWhoLikes !== 'boolean' ? avatarWhoLikes : []

  return (
    <Modal open={open} onOpenChange={closeModal} header="custom" size="lg" cardPadding="none">
      <div className={s.container}>
        <div className={s.imageWrapper}>
          <ImageSlider images={images.map(({ url }, index) => ({ src: url, alt: `Post image ${index + 1}` }))} />
        </div>

        <div className={s.contentWrapper}>
          <div className={s.header}>
            <UserCard user={{ id: ownerId, userName, avatar }} />
          </div>

          <Separator />

          <Scroll className={s.scroll}>
            <PostItem post={post} />
          </Scroll>

          <Separator />

          <div className={s.footer}>
            {likesCount > 0 && (
              <div className={s.likes}>
                {/* <AvatarGroup avatars={arrayOfAvatars} /> */}

                <Typography variant={'body2'}>
                  {likesCount} <b>"Like"</b>
                </Typography>
              </div>
            )}

            <DateStamp date={createdAt} />
          </div>
        </div>
      </div>
    </Modal>
  )
}
