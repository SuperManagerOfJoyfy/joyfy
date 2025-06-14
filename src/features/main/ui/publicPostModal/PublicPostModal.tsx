import { Post } from '@/features/post/types/postTypes'

import { ImageSlider, Modal } from '@/shared/ui'
import { PublicPostContent } from './PublicPostContent'
import s from './publicPostModal.module.scss'

type Props = {
  open: boolean
  closeModal: () => void
  post: Post | null
}

export const PublicPostModal = ({ open, closeModal, post }: Props) => {
  if (!post) return null

  const { images } = post

  return (
    <Modal open={open} onOpenChange={closeModal} header="custom" size="lg" cardPadding="none">
      <div className={s.container}>
        <div className={s.imageWrapper}>
          <ImageSlider images={images.map(({ url }, index) => ({ src: url, alt: `Post image ${index + 1}` }))} />
        </div>

        <PublicPostContent post={post} />
      </div>
    </Modal>
  )
}
