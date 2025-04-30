'use client'

import { ChangeEvent, useState } from 'react'
import { Typography } from '@/shared/ui'
import { ImageSettings } from '@/features/post/types/types'

import s from './StepDescription.module.css'
import { ImageSlider } from '@/entities/post/ui/imageSlider'

type StepDescriptionProps = {
  files: File[]
  imagePreviews: string[]
  currentImageIndex: number
  onImageIndexChange: (index: number) => void
  onPrevImage: () => void
  onNextImage: () => void
  imageSettings: ImageSettings[]
  initialDescription: string
  onDescriptionChange: (text: string) => void
  onBack: () => void
  onPublish: () => void
  isPublishing?: boolean
  error?: string | null
}

export const StepDescription = ({
  files,
  imagePreviews,
  currentImageIndex,
  onImageIndexChange,
  onPrevImage,
  onNextImage,
  imageSettings,
  initialDescription,
  onDescriptionChange,
  onBack,
  onPublish,
  isPublishing = false,
  error: externalError = null,
}: StepDescriptionProps) => {
  const [description, setDescription] = useState(initialDescription)
  const [internalError, setInternalError] = useState<string | null>(null)

  const error = externalError || internalError

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setDescription(text)
    onDescriptionChange(text)
  }

  const handlePublishClick = async () => {
    try {
      setInternalError(null)
      await onPublish()
    } catch (err) {
      console.error('Failed to publish post:', err)
      setInternalError('Failed to publish post. Please try again.')
    }
  }

  const getCurrentImageSettings = () => {
    return (
      imageSettings[currentImageIndex] || {
        aspectRatio: '1:1',
        filter: 'Normal',
        zoom: 1,
      }
    )
  }

  const currentSettings = getCurrentImageSettings()

  const getAspectRatioClass = () => {
    switch (currentSettings.aspectRatio) {
      case '1:1':
        return s.square
      case '4:5':
        return s.portrait
      case '16:9':
        return s.landscape
      default:
        return s.square
    }
  }

  const previewImagesWithFilters = imagePreviews.map((preview, index) => ({
    src: preview,
    alt: `Preview ${index + 1}`,
    className: `${s.preview} ${s[imageSettings[index]?.filter.toLowerCase() || 'normal']}`,
  }))

  const isDescriptionEmpty = description.trim().length === 0

  return (
    <div className={s.container}>
      <div className={s.content}>
        {files.length > 0 && (
          <div className={s.imagePreview}>
            <ImageSlider
              images={previewImagesWithFilters}
              aspectRatio={
                currentSettings.aspectRatio === '1:1'
                  ? 'square'
                  : currentSettings.aspectRatio === '4:5'
                    ? 'tall'
                    : 'wide'
              }
              initialSlide={currentImageIndex}
              onSlideChange={onImageIndexChange}
              showControls={true}
              showPagination={true}
              className={s.swiper}
            />
          </div>
        )}

        <div className={s.formContainer}>
          <div className={s.descriptionContainer}>
            <Typography variant="caption">Description</Typography>
            <textarea
              className={s.textarea}
              placeholder="Add a description..."
              value={description}
              onChange={handleDescriptionChange}
              maxLength={500}
              rows={6}
            />
            <div className={s.charCount}>
              <Typography variant="caption">{description.length}/500</Typography>
            </div>
          </div>

          {error && (
            <Typography variant="body2" className={s.error}>
              {error}
            </Typography>
          )}
        </div>
      </div>
    </div>
  )
}
