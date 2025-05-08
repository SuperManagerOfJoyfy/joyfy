'use client'

import { ChangeEvent } from 'react'

import { TextArea, Typography } from '@/shared/ui'
import { ImageSlider } from '@/entities/post/ui/imageSlider'
import { usePostContext } from '../../providers/PostContext'

import s from './StepDescription.module.scss'

type StepDescriptionProps = {
  disabled?: boolean
}

export const StepDescription = ({ disabled }: StepDescriptionProps) => {
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

        <div className={s.formContainer}>
          <div className={s.descriptionContainer}>
            <Typography variant="caption">Description</Typography>
            <TextArea
              placeholder="Add a description..."
              value={description}
              onChange={handleDescriptionChange}
              maxLength={500}
              rows={6}
              disabled={disabled}
            />
            <div className={s.charCount}>
              <Typography variant="caption">{description.length}/500</Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
