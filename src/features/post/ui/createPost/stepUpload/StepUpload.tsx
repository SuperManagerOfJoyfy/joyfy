'use client'

import { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiCamera, FiPlus, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { IoClose } from 'react-icons/io5'
import { Button, Typography } from '@/shared/ui'
import Image from 'next/image'
import { ACCEPTED_TYPES, MAX_FILE_SIZE_MB, MAX_IMAGES } from '@/features/post/utils/constats'

import s from './StepUpload.module.scss'

type StepUploadProps = {
  onClose: () => void
  onNext: (files: File[]) => void
  hasDraft?: boolean
}

export const StepUpload = ({ onClose, onNext, hasDraft = false }: StepUploadProps) => {
  const [error, setError] = useState<string | null>(null)
  const [previews, setPreviews] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isDragActive, setIsDragActive] = useState(false)

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview)
        }
      })
    }
  }, [previews])

  const validateFile = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'The photo must be JPEG or PNG'
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `The photo must be less than ${MAX_FILE_SIZE_MB} MB`
    }
    return null
  }

  const processFiles = useCallback(
    (acceptedFiles: File[]) => {
      if (selectedFiles.length + acceptedFiles.length > MAX_IMAGES) {
        setError(`You can only upload a maximum of ${MAX_IMAGES} images`)
        return
      }

      const validFiles: File[] = []
      const newPreviews: string[] = []

      for (const file of acceptedFiles) {
        const errorMessage = validateFile(file)
        if (errorMessage) {
          setError(errorMessage)
          continue
        }

        try {
          const objectUrl = URL.createObjectURL(file)
          validFiles.push(file)
          newPreviews.push(objectUrl)
        } catch (err) {
          console.error('Failed to process file:', err)
        }
      }

      setSelectedFiles((prev) => [...prev, ...validFiles])
      setPreviews((prev) => [...prev, ...newPreviews])
      setError(null)
    },
    [selectedFiles.length]
  )

  const {
    getRootProps,
    getInputProps,
    open: openFileDialog,
  } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    onDrop: processFiles,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: (rejections) => {
      setIsDragActive(false)
      const error = rejections[0]?.errors[0]?.message || 'Invalid file'
      setError(error)
    },
    multiple: true,
    maxFiles: MAX_IMAGES,
    noClick: false,
  })

  const removeImage = (index: number) => {
    const newPreviews = [...previews]
    const newFiles = [...selectedFiles]

    if (previews[index] && previews[index].startsWith('blob:')) {
      URL.revokeObjectURL(previews[index])
    }

    newPreviews.splice(index, 1)
    newFiles.splice(index, 1)

    setPreviews(newPreviews)
    setSelectedFiles(newFiles)

    if (currentImageIndex >= newPreviews.length) {
      setCurrentImageIndex(Math.max(0, newPreviews.length - 1))
    }
  }

  const handleContinue = () => {
    if (selectedFiles.length > 0) {
      onNext(selectedFiles)
    }
  }

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  const handleNextImage = () => {
    if (currentImageIndex < previews.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }

  const openDraft = () => {
    console.log('Open draft clicked')
    alert(
      'Draft functionality is limited in this demo. In a real app, files would need to be stored on the server to be restored.'
    )
  }

  return (
    <div className={s.container}>
      {selectedFiles.length === 0 ? (
        <>
          <div {...getRootProps()} className={`${s.dropzone} ${isDragActive ? s.dragging : ''}`}>
            <input {...getInputProps()} aria-label="Upload photo" />
            <div className={s.placeholder}>
              <FiCamera size={48} className={s.icon} />
              <Typography variant="body2" className={s.dropText}>
                {isDragActive ? 'Drop the image here' : 'Drag and drop your image here or click to browse'}
              </Typography>
            </div>
          </div>

          {error && (
            <Typography variant="body2" className={s.error}>
              {error}
            </Typography>
          )}

          <div className={s.buttons}>
            <Button onClick={openFileDialog} variant="primary" fullWidth className={s.button}>
              Select from Computer
            </Button>

            {hasDraft && (
              <Button onClick={openDraft} variant="outline" fullWidth className={s.button}>
                Open Draft
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          <div className={s.sliderContainer}>
            {previews.length > 1 && (
              <div className={s.navigationControls}>
                <button
                  onClick={handlePrevImage}
                  disabled={currentImageIndex === 0}
                  className={s.navButton}
                  type="button"
                  aria-label="Previous image"
                >
                  <FiChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNextImage}
                  disabled={currentImageIndex === previews.length - 1}
                  className={s.navButton}
                  type="button"
                  aria-label="Next image"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            )}

            <div className={s.imageWrapper}>
              {previews[currentImageIndex] && (
                <Image
                  src={previews[currentImageIndex]}
                  alt={`Preview ${currentImageIndex + 1}`}
                  width={500}
                  height={500}
                  className={s.preview}
                />
              )}
              <Button
                variant="icon"
                onClick={() => removeImage(currentImageIndex)}
                className={s.clearButton}
                aria-label="Remove image"
              >
                <IoClose size={24} />
              </Button>
            </div>

            {previews.length > 1 && (
              <div className={s.pagination}>
                {previews.map((_, idx) => (
                  <div
                    key={`indicator-${idx}`}
                    className={`${s.paginationDot} ${idx === currentImageIndex ? s.active : ''}`}
                    onClick={() => setCurrentImageIndex(idx)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            )}

            {selectedFiles.length < MAX_IMAGES && (
              <Button
                variant="outline"
                onClick={openFileDialog}
                className={s.addMoreButton}
                aria-label="Add more images"
              >
                <FiPlus size={20} />
                <span>Add more</span>
              </Button>
            )}
          </div>

          {error && (
            <Typography variant="body2" className={s.error}>
              {error}
            </Typography>
          )}

          <div className={s.buttons}>
            <Button
              onClick={handleContinue}
              variant="primary"
              fullWidth
              className={s.button}
              disabled={selectedFiles.length === 0}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
