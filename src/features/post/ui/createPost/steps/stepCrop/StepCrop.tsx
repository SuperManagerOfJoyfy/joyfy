'use client'

import { useState } from 'react'
import { Button, Typography } from '@/shared/ui'
import { AspectRatioType } from '@/features/post/types/types'
import { ImageSlider } from '@/entities/post/ui/imageSlider'

import s from './StepCrop.module.scss'

type StepCropProps = {
  files: File[]
  imagePreviews: string[]
  currentImageIndex: number
  onImageIndexChange: (index: number) => void
  onPrevImage: () => void
  onNextImage: () => void
  onBack: () => void
  onNext: () => void
  initialAspectRatio: AspectRatioType
  initialZoom: number
  onAspectRatioChange: (ratio: AspectRatioType) => void
  onZoomChange: (zoom: number) => void
}

export const StepCrop = ({
  files,
  imagePreviews,
  currentImageIndex,
  onImageIndexChange,
  onPrevImage,
  onNextImage,
  onBack,
  onNext,
  initialAspectRatio,
  initialZoom,
  onAspectRatioChange,
  onZoomChange,
}: StepCropProps) => {
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>(initialAspectRatio)
  const [zoom, setZoom] = useState(initialZoom)

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(e.target.value)
    setZoom(newZoom)
    onZoomChange(newZoom)
  }

  const handleAspectRatioChange = (ratio: AspectRatioType) => {
    setAspectRatio(ratio)
    onAspectRatioChange(ratio)
  }

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
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

  const handleSlideChange = (index: number) => {
    onImageIndexChange(index)
  }

  const previewImages = imagePreviews.map((src, index) => ({
    src,
    alt: `Preview ${index + 1}`,
  }))

  return (
    <div className={s.container}>
      <div className={s.cropContainer}>
        <div className={`${s.sliderWrapper} ${getAspectRatioClass()}`}>
          <div
            className={s.imageContainer}
            style={{
              transform: `scale(${zoom})`,
              width: '100%',
              height: '100%',
            }}
          >
            <ImageSlider
              images={previewImages}
              aspectRatio={aspectRatio === '1:1' ? 'square' : aspectRatio === '4:5' ? 'tall' : 'wide'}
              initialSlide={currentImageIndex}
              onSlideChange={handleSlideChange}
              showControls={true}
            />
          </div>
        </div>
      </div>

      <div className={s.controls}>
        <div className={s.aspectRatioControls}>
          <Typography variant="caption">Aspect Ratio</Typography>
          <div className={s.aspectRatioButtons}>
            <button
              className={`${s.aspectRatioButton} ${aspectRatio === '1:1' ? s.active : ''}`}
              onClick={() => handleAspectRatioChange('1:1')}
              type="button"
            >
              1:1
            </button>
            <button
              className={`${s.aspectRatioButton} ${aspectRatio === '4:5' ? s.active : ''}`}
              onClick={() => handleAspectRatioChange('4:5')}
              type="button"
            >
              4:5
            </button>
            <button
              className={`${s.aspectRatioButton} ${aspectRatio === '16:9' ? s.active : ''}`}
              onClick={() => handleAspectRatioChange('16:9')}
              type="button"
            >
              16:9
            </button>
          </div>
        </div>

        <div className={s.zoomControl}>
          <Typography variant="caption">Zoom</Typography>
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={zoom}
            onChange={handleZoomChange}
            className={s.zoomSlider}
          />
        </div>
      </div>
    </div>
  )
}
