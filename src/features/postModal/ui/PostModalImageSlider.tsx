import { ImageSlider } from '@/shared/ui/imageSlider'
import { usePostModalContext } from '../context/PostModalContext'
import s from './PostModal.module.scss'

export const PostModalImageSlider = () => {
  const { currentPost } = usePostModalContext()
  const { images } = currentPost

  const imageData = images.map((img, idx) => ({
    src: img.url,
    alt: `Post image ${idx + 1}`,
  }))

  return (
    <div className={s.imageWrapper}>
      <ImageSlider images={imageData} />
    </div>
  )
}
