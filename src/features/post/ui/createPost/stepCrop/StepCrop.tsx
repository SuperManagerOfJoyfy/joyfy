'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button, Typography } from '@/shared/ui'
import { AspectRatioType } from '@/features/post/types/types'

import s from './StepCrop.module.scss'

type StepCropProps = {
  files: File[]
  onBack: () => void
  onNext: (files: File[], aspectRatio: AspectRatioType, zoom: number) => void
  initialAspectRatio?: AspectRatioType
  initialZoom?: number
}

export const StepCrop = ({ files, onBack, onNext, initialAspectRatio = '1:1', initialZoom = 1 }: StepCropProps) => {
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>(initialAspectRatio)
  const [zoom, setZoom] = useState(initialZoom)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  useEffect(() => {
    const previews = files.map((file) => URL.createObjectURL(file))
    setImagePreviews(previews)

    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview))
    }
  }, [files])

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(parseFloat(e.target.value))
  }

  const handleAspectRatioChange = (ratio: AspectRatioType) => {
    setAspectRatio(ratio)
  }

  const handleNext = () => {
    onNext(files, aspectRatio, zoom)
  }

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  const handleNextImage = () => {
    if (currentImageIndex < files.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
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

  return (
    <div className={s.container}>
      <div className={s.cropContainer}>
        {files.length > 1 && (
          <div className={s.navigationControls}>
            <button onClick={handlePrevImage} disabled={currentImageIndex === 0} className={s.navButton} type="button">
              &lt;
            </button>
            <button
              onClick={handleNextImage}
              disabled={currentImageIndex === files.length - 1}
              className={s.navButton}
              type="button"
            >
              &gt;
            </button>
          </div>
        )}
        <div className={`${s.imageWrapper} ${getAspectRatioClass()}`}>
          {imagePreviews[currentImageIndex] && (
            <div className={s.imageContainer} style={{ transform: `scale(${zoom})` }}>
              <Image
                src={imagePreviews[currentImageIndex]}
                alt={`Preview ${currentImageIndex + 1}`}
                width={500}
                height={500}
                className={s.preview}
              />
            </div>
          )}
        </div>
        {files.length > 1 && (
          <div className={s.pagination}>
            {files.map((_, idx) => (
              <div
                key={`indicator-${idx}`}
                className={`${s.paginationDot} ${idx === currentImageIndex ? s.active : ''}`}
                onClick={() => setCurrentImageIndex(idx)}
              />
            ))}
          </div>
        )}
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

      <div className={s.buttons}>
        <Button onClick={onBack} variant="outline" className={s.button} fullWidth>
          Back
        </Button>
        <Button onClick={handleNext} variant="primary" className={s.button} fullWidth>
          Next
        </Button>
      </div>
    </div>
  )
}
