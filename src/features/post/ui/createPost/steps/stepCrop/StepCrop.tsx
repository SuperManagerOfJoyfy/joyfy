'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button, Typography } from '@/shared/ui'
import { AspectRatioType } from '@/features/post/types/types'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

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
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null)

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

  const handleSlideChange = (swiper: SwiperType) => {
    onImageIndexChange(swiper.activeIndex)
  }

  return (
    <div className={s.container}>
      <div className={s.cropContainer}>
        <div className={`${s.swiperWrapper} ${getAspectRatioClass()}`}>
          <Swiper
            modules={[Navigation, Pagination]}
            onSwiper={setSwiperInstance}
            initialSlide={currentImageIndex}
            onSlideChange={handleSlideChange}
            className={s.swiper}
            navigation={true}
            pagination={{
              clickable: true,
              type: 'bullets',
            }}
          >
            {imagePreviews.map((src, index) => (
              <SwiperSlide key={`slide-${index}`}>
                <div
                  className={s.imageContainer}
                  style={{
                    transform: `scale(${zoom})`,
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <Image
                    src={src}
                    alt={`Preview ${index + 1}`}
                    width={493}
                    height={503}
                    className={s.preview}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
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

      <div className={s.buttons}>
        <Button onClick={onBack} variant="outline" className={s.button} fullWidth>
          Back
        </Button>
        <Button onClick={onNext} variant="primary" className={s.button} fullWidth>
          Next
        </Button>
      </div>
    </div>
  )
}
