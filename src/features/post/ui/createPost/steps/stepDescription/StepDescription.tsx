'use client'

import { ChangeEvent } from 'react'

import { usePostContext } from '@/features/post/ui/createPost/providers'
import { ImageSlider } from '@/shared/ui/imageSlider'

import { User } from '@/entities/user/ui/userCard'
import { PublicationDescription, UserCard } from '@/shared/ui'
import s from './StepDescription.module.scss'

type StepDescriptionProps = {
  disabled?: boolean
  user: User
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
        <div className={s.descriptionWrapper}>
          <UserCard user={user} />
          <PublicationDescription
            value={description}
            onChange={handleDescriptionChange}
            disabled={disabled}
            className={s.description}
          />
        </div>
      </div>
    </div>
  )
}
