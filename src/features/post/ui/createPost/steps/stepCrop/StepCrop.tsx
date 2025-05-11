'use client'

import { useEffect } from 'react'

import { ImageSlider } from '@/shared/ui/imageSlider'
import { usePostContext } from '../../providers/PostContext'
import { ImageControls } from './imageControls/ImageControls'

import s from './StepCrop.module.scss'

type StepCropProps = {
  onNavigateBack?: () => void
}

export const StepCrop = ({ onNavigateBack }: StepCropProps) => {
  const { imagePreviews, imagesEditData, currentImageIdx, images, setCurrentImageIndex } = usePostContext()

  const handleSlideChange = (index: number) => {
    setCurrentImageIndex(index)
  }

  const previewImages = imagePreviews.map((src, index) => ({
    src,
    alt: `Preview ${index + 1}`,
  }))

  useEffect(() => {
    if (imagePreviews.length === 0 && onNavigateBack) {
      onNavigateBack()
    }
  }, [imagePreviews.length, onNavigateBack])

  return (
    <div className={s.container}>
      <div className={s.cropContainer}>
        {previewImages.length > 0 && (
          <ImageSlider
            images={previewImages}
            initialSlide={currentImageIdx}
            onSlideChange={handleSlideChange}
            className={s.imageSlider}
            key={`slider-${imagePreviews.length}`}
          />
        )}
      </div>

      {imagesEditData[currentImageIdx] && (
        <div className={s.controlsWrapper}>
          <ImageControls />
        </div>
      )}
    </div>
  )
}
