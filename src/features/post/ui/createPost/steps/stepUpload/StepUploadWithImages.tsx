'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiPlus } from 'react-icons/fi'
import { Button, Typography } from '@/shared/ui'
import { ImageSlider } from '@/entities/post/ui/imageSlider'

import { MAX_IMAGES } from '@/features/post/utils/constats'
import { toast } from 'react-toastify'

import s from './StepUpload.module.scss'

type StepUploadWithImagesProps = {
  selectedFiles: File[]
  previews: string[]
  activeIndex: number
  setActiveIndex: (index: number) => void
  removeImage: (index: number) => void
  processFiles: (acceptedFiles: File[]) => File[]
  onContinue: () => void
  error: string | null
}

export const StepUploadWithImages = ({
  selectedFiles,
  previews,
  activeIndex,
  setActiveIndex,
  removeImage,
  processFiles,
  onContinue,
  error,
}: StepUploadWithImagesProps) => {
  const {
    getRootProps,
    getInputProps,
    open: openFileDialog,
  } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    onDrop: processFiles,
    multiple: true,
    noClick: true,
  })

  const handleSlideChange = (index: number) => {
    setActiveIndex(index)
  }

  const handleAddMore = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      openFileDialog()
    },
    [openFileDialog]
  )

  const previewImages = previews.map((src, index) => ({
    src,
    alt: `Image ${index + 1}`,
  }))

  return (
    <div className={s.container}>
      <div className={s.sliderContainer}>
        {previews.length > 0 && (
          <div className={s.imageWrapper}>
            <ImageSlider
              images={previewImages}
              aspectRatio="square"
              initialSlide={activeIndex}
              onSlideChange={handleSlideChange}
              showControls={true}
              showPagination={true}
              showCounter={true}
              className={s.slider}
            />
            <Button
              variant="icon"
              onClick={(e) => {
                e.stopPropagation()
                removeImage(activeIndex)
              }}
              className={s.removeButton}
              aria-label="Remove image"
            >
              X
            </Button>
          </div>
        )}
      </div>

      {selectedFiles.length < MAX_IMAGES && (
        <div className={s.addMoreWrapper}>
          <Button variant="outline" onClick={handleAddMore} className={s.addMoreButton} aria-label="Add more images">
            <FiPlus size={20} />
            <span>Add more</span>
          </Button>
        </div>
      )}

      {error && (
        <Typography variant="body2" className={s.error}>
          {error}
        </Typography>
      )}

      <div className={s.buttons}>
        <Button
          onClick={onContinue}
          variant="primary"
          fullWidth
          className={s.button}
          disabled={selectedFiles.length === 0}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
