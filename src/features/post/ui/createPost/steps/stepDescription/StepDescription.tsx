'use client'

import { ChangeEvent } from 'react'

import { ImageSlider } from '@/shared/ui/imageSlider'
import { UserProfileProps } from '@/features/profile/ui/userProfile'
import { PostDescriptionForm } from '@/entities/post/ui'
import { usePostContext } from '../../providers/PostContext'

import s from './StepDescription.module.scss'

type StepDescriptionProps = {
  disabled?: boolean
  user: Pick<UserProfileProps, 'userName' | 'avatars' | 'id'>
}

export const StepDescription = ({ disabled, user }: StepDescriptionProps) => {
  const { imagePreviews, description, setDescription, setCurrentImageIndex, currentImageIdx } = usePostContext()

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setDescription(text)
  }

  const handleSlideChange = (index: number) => {
    setCurrentImageIndex(index)
  }

  const previewImages = imagePreviews.map((src, index) => ({
    src,
    alt: `Preview ${index + 1}`,
  }))

  return (
    <div className={s.container}>
      <div className={s.content}>
        <div className={s.imagePreview}>
          <ImageSlider
            images={previewImages}
            initialSlide={currentImageIdx}
            onSlideChange={handleSlideChange}
            className={s.swiper}
          />
        </div>

        <PostDescriptionForm user={user} value={description} onChange={handleDescriptionChange} disabled={disabled} />
      </div>
    </div>
  )
}
