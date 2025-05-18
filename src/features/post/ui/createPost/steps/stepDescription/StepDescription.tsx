'use client'

import { ChangeEvent } from 'react'

import { ImageSlider } from '@/shared/ui/imageSlider'
import { PostDescriptionForm } from '@/entities/post/ui'
import { usePostContext } from '../../providers/PostContext'
import { UserProfile } from '@/features/profile/api/profileApi.types'

import s from './StepDescription.module.scss'
import { Separator } from '@radix-ui/react-dropdown-menu'

type StepDescriptionProps = {
  disabled?: boolean
  user: Pick<UserProfile, 'userName' | 'avatars' | 'id'>
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

        <PostDescriptionForm
          user={user}
          value={description}
          onChange={handleDescriptionChange}
          disabled={disabled}
          className={s.description}
        />
      </div>
    </div>
  )
}
