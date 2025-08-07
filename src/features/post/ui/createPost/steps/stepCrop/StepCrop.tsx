'use client'

import { useEffect, useMemo, useCallback, memo } from 'react'

import { ImageSlider } from '@/shared/ui/imageSlider'
import { Loader } from '@/shared/ui'
import { usePostContext } from '../../providers/PostContext'
import { ImageControls } from './imageControls/ImageControls'

import s from './StepCrop.module.scss'

type StepCropProps = {
  jumpToStep?: (step: string) => void
}

const ImageSliderMemo = memo(ImageSlider)
const ImageControlsMemo = memo(ImageControls)

export const StepCrop = memo(({ jumpToStep }: StepCropProps) => {
  const { imagePreviews, imagesEditData, currentImageIdx, images, setCurrentImageIndex } = usePostContext()

  const handleSlideChange = useCallback(
    (index: number) => {
      setCurrentImageIndex(index)
    },
    [setCurrentImageIndex]
  )

  const previewImages = useMemo(
    () =>
      imagePreviews.map((src, index) => ({
        src,
        alt: `Preview ${index + 1}`,
      })),
    [imagePreviews]
  )

  const hasImages = images.length > 0
  const hasPreviews = imagePreviews.length > 0
  const hasCurrentEditData = Boolean(imagesEditData[currentImageIdx])
  const isLoading = hasImages && !hasPreviews

  useEffect(() => {
    if (images.length === 0 && jumpToStep) {
      jumpToStep('upload')
    }
  }, [images.length, jumpToStep])

  if (isLoading) {
    return <Loader message="Loading images..." />
  }

  return (
    <div className={s.container}>
      <div className={s.cropContainer}>
        {hasPreviews && (
          <ImageSliderMemo
            images={previewImages}
            initialSlide={currentImageIdx}
            onSlideChange={handleSlideChange}
            className={s.imageSlider}
            key={`slider-${imagePreviews.length}`}
          />
        )}
      </div>

      {hasCurrentEditData && (
        <div className={s.controlsWrapper}>
          <ImageControlsMemo />
        </div>
      )}
    </div>
  )
})
