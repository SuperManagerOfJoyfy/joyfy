'use client'

import { useRef, useState, useEffect, ChangeEvent, DragEvent } from 'react'
import { FiCamera, FiPlus } from 'react-icons/fi'
import { Button, Typography } from '@/shared/ui'
import {
  ACCEPTED_TYPES,
  MAX_FILE_SIZE_MB,
} from '@/features/post/utils/constats'

import s from './stepUpload.module.scss'
import Image from 'next/image'
import { IoClose } from 'react-icons/io5'

type StepUploadProps = {
  onClose: () => void
  onNext: (files: File[]) => void
}

export const StepUpload = ({ onClose, onNext }: StepUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [previews, setPreviews] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Clean up object URLs when component unmounts or when previews change
  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        if (preview && preview.startsWith('blob:')) {
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

  const handleSelectClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const processFile = (file: File) => {
    const errorMessage = validateFile(file)
    if (errorMessage) {
      setError(errorMessage)
      return false
    }

    setIsLoading(true)
    setError(null)

    try {
      const objectUrl = URL.createObjectURL(file)
      setPreviews((prev) => [...prev, objectUrl])
      setSelectedFiles((prev) => [...prev, file])
      return true
    } catch (err) {
      setError('Failed to process image')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    processFile(file)

    // Reset the input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeImage = (index: number) => {
    // Revoke the URL for the removed preview
    if (previews[index] && previews[index].startsWith('blob:')) {
      URL.revokeObjectURL(previews[index])
    }

    setPreviews((prev) => prev.filter((_, i) => i !== index))
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))

    // Adjust current index if needed
    if (index <= currentImageIndex && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
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

  return (
    <div className={s.container}>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/png"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        aria-label="Upload photo"
      />

      {selectedFiles.length === 0 ? (
        <div
          className={`${s.dropzone} ${isDragging ? s.dragging : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleSelectClick}
        >
          <div className={s.placeholder}>
            <FiCamera size={48} className={s.icon} />
            <Typography variant="body2" className={s.dropText}>
              {isDragging
                ? 'Drop the image here'
                : 'Drag and drop your image here or click to browse'}
            </Typography>
          </div>
        </div>
      ) : (
        <div className={s.sliderContainer}>
          <div className={s.cropContainer}>
            {previews.length > 1 && (
              <div className={s.navigationControls}>
                <button
                  onClick={handlePrevImage}
                  disabled={currentImageIndex === 0}
                  className={s.navButton}
                  type="button"
                >
                  &lt;
                </button>
                <button
                  onClick={handleNextImage}
                  disabled={currentImageIndex === previews.length - 1}
                  className={s.navButton}
                  type="button"
                >
                  &gt;
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
                  />
                ))}
              </div>
            )}
          </div>

          {selectedFiles.length < 10 && (
            <Button
              variant="outline"
              onClick={handleSelectClick}
              className={s.addMoreButton}
              aria-label="Add more images"
            >
              <FiPlus size={20} />
              <span>Add more</span>
            </Button>
          )}
        </div>
      )}

      {error && (
        <Typography variant="body2" className={s.error}>
          {error}
        </Typography>
      )}

      <div className={s.buttons}>
        {selectedFiles.length === 0 ? (
          <>
            <Button
              onClick={handleSelectClick}
              disabled={isLoading}
              variant="primary"
              fullWidth
              className={s.button}
            >
              {isLoading ? 'Loading...' : 'Select from Computer'}
            </Button>
            <Button variant="outline" fullWidth className={s.button}>
              Open Draft
            </Button>
          </>
        ) : (
          <Button
            onClick={handleContinue}
            variant="primary"
            fullWidth
            className={s.button}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  )
}
