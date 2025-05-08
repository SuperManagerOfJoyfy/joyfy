'use client'

import { FiTrash2, FiZoomIn } from 'react-icons/fi'
import { TbAspectRatio } from 'react-icons/tb'
import { ChangeEvent, useState, useEffect } from 'react'

import { AspectRatioType } from '@/features/post/types/types'
import { ImageSlider } from '@/entities/post/ui/imageSlider'
import { usePostContext } from '../../providers/PostContext'
import { Button } from '@/shared/ui'
import { useImageValidation } from '@/features/post/hooks/useImageValidation'
import { ImageUploadButton } from './imageUploadButton/ImageUploadButton'

import s from './StepCrop.module.scss'

type StepCropProps = {
  onNavigateBack?: () => void
}

export const StepCrop = ({ onNavigateBack }: StepCropProps) => {
  const {
    imagePreviews,
    imagesEditData,
    setImageEditData,
    setCurrentImageIndex,
    currentImageIdx,
    addImage,
    removeImage,
    images,
    resetToOriginal,
  } = usePostContext()

  const { MAX_IMAGES } = useImageValidation()

  const [showAspectRatioOptions, setShowAspectRatioOptions] = useState(false)
  const [showZoomSlider, setShowZoomSlider] = useState(false)
  const [showTextEditor, setShowTextEditor] = useState(false)
  const [imageText, setImageText] = useState<string[]>(Array(images.length).fill(''))

  const handleZoomChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(e.target.value)
    setImageEditData({ scale: newZoom })
  }

  const handleAspectRatioChange = (ratio: AspectRatioType) => {
    setImageEditData({ aspectRatio: ratio })
  }

  const handleSlideChange = (index: number) => {
    setCurrentImageIndex(index)
    setShowTextEditor(false)
    setShowZoomSlider(false)
    setShowAspectRatioOptions(false)
  }

  const previewImages = imagePreviews.map((src, index) => ({
    src,
    alt: `Preview ${index + 1}`,
    caption: imageText[index] || '',
  }))

  const handleAddMorePhotos = (files: File[]) => {
    if (files.length > 0) {
      addImage(files)
      setImageText((prev) => [...prev, ...Array(files.length).fill('')])
    }
  }

  const handleRemoveImage = () => {
    if (imagePreviews.length === 0) return

    removeImage(currentImageIdx)
    setImageText((prev) => {
      const newText = [...prev]
      newText.splice(currentImageIdx, 1)
      return newText
    })

    if (imagePreviews.length > 1) {
      if (currentImageIdx >= imagePreviews.length - 1) {
        setCurrentImageIndex(currentImageIdx - 1)
      }
    } else {
      onNavigateBack?.()
    }
  }

  const toggleAspectRatioOptions = () => {
    setShowAspectRatioOptions((prev) => !prev)
    setShowZoomSlider(false)
  }

  const toggleZoomSlider = () => {
    setShowZoomSlider((prev) => !prev)
    setShowAspectRatioOptions(false)
  }

  useEffect(() => {
    if (imagePreviews.length === 0 && onNavigateBack) {
      onNavigateBack()
    }
  }, [imagePreviews.length, onNavigateBack])

  return (
    <div className={s.container}>
      <div className={s.header}>
        <Button variant="icon" onClick={handleRemoveImage} className={s.controlButton}>
          <div className={s.iconSquare}>
            <FiTrash2 size={20} />
          </div>
        </Button>
      </div>

      <div className={s.cropContainer}>
        {imagePreviews.length > 0 && (
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
          <div className={s.controls}>
            <div className={s.controlContainer}>
              <div className={s.controlItem}>
                <Button
                  variant="icon"
                  className={`${s.controlButton} ${showAspectRatioOptions ? s.active : ''}`}
                  onClick={toggleAspectRatioOptions}
                  type="button"
                >
                  <div className={s.iconSquare}>
                    <TbAspectRatio size={20} />
                  </div>
                </Button>
                <div className={`${s.expandedControl} ${showAspectRatioOptions ? s.show : ''}`}>
                  <div className={s.aspectRatioOptions}>
                    <div className={s.aspectRatioTitle}>
                      <Button
                        variant="outline"
                        className={`${s.aspectRatioOption} ${imagesEditData[currentImageIdx]?.aspectRatio === 'original' ? s.active : ''}`}
                        onClick={() => resetToOriginal(currentImageIdx)}
                      >
                        <TbAspectRatio size={28} />
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      className={`${s.aspectRatioOption} ${imagesEditData[currentImageIdx]?.aspectRatio === '1:1' ? s.active : ''}`}
                      onClick={() => handleAspectRatioChange('1:1')}
                    >
                      1:1
                    </Button>
                    <Button
                      variant="outline"
                      className={`${s.aspectRatioOption} ${imagesEditData[currentImageIdx]?.aspectRatio === '4:5' ? s.active : ''}`}
                      onClick={() => handleAspectRatioChange('4:5')}
                    >
                      4:5
                    </Button>
                    <Button
                      variant="outline"
                      className={`${s.aspectRatioOption} ${imagesEditData[currentImageIdx]?.aspectRatio === '16:9' ? s.active : ''}`}
                      onClick={() => handleAspectRatioChange('16:9')}
                    >
                      16:9
                    </Button>
                  </div>
                </div>
              </div>

              <div className={s.controlItem}>
                <Button
                  variant="icon"
                  className={`${s.controlButton} ${showZoomSlider ? s.active : ''}`}
                  onClick={toggleZoomSlider}
                  type="button"
                >
                  <div className={s.iconSquare}>
                    <FiZoomIn size={20} />
                  </div>
                </Button>
                <div className={`${s.expandedControl} ${showZoomSlider ? s.show : ''}`}>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={imagesEditData[currentImageIdx]?.scale}
                    onChange={handleZoomChange}
                    className={s.zoomSlider}
                  />
                </div>
              </div>
            </div>

            <div className={s.controlItem}>
              <div className={s.iconSquare}>
                <ImageUploadButton
                  onFilesSelected={handleAddMorePhotos}
                  maxFileSize={5}
                  maxImages={MAX_IMAGES}
                  validateCurrentCount={images.length}
                  iconSize={20}
                  className={s.miniUploader}
                  buttonClassName={s.miniButton}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
