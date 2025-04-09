'use client'

import { useRef, useState, useEffect, ChangeEvent, DragEvent } from 'react'
import Image from 'next/image'
import { FiCamera, FiX, FiUpload } from 'react-icons/fi'

import { Button, Typography } from '@/shared/ui'
import {
  ACCEPTED_TYPES,
  MAX_FILE_SIZE_MB,
} from '@/features/post/utils/constats'

import s from './stepUpload.module.scss'

type StepUploadProps = {
  onClose: () => void
  onUploadComplete?: (imageData: File) => void
}

export const StepUpload = ({ onClose, onUploadComplete }: StepUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

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
    fileInputRef.current?.click()
  }

  const processFile = (file: File) => {
    const errorMessage = validateFile(file)
    if (errorMessage) {
      setError(errorMessage)
      return false
    }

    setIsLoading(true)
    setError(null)

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setSelectedFile(file)
    setIsLoading(false)
    return true
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    processFile(file)
  }

  const clearSelection = () => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
    setPreview(null)
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
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
    if (selectedFile && onUploadComplete) {
      onUploadComplete(selectedFile)
    }
    onClose()
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

      <div
        className={`${s.dropzone} ${isDragging ? s.dragging : ''} ${
          preview ? s.hasPreview : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className={s.previewContainer}>
            <Image
              src={preview}
              alt="Preview"
              width={300}
              height={300}
              className={s.preview}
            />
            <button
              onClick={clearSelection}
              className={s.clearButton}
              aria-label="Remove image"
            >
              <FiX size={20} />
            </button>
          </div>
        ) : (
          <div className={s.placeholder}>
            <FiCamera size={48} className={s.icon} />
            <Typography variant="body2" className={s.dropText}>
              {isDragging
                ? 'Drop the image here'
                : 'Drag and drop your image here or click to browse'}
            </Typography>
          </div>
        )}
      </div>

      {error && (
        <Typography variant="body2" className={s.error}>
          {error}
        </Typography>
      )}

      <div className={s.buttons}>
        <Button
          onClick={handleSelectClick}
          disabled={isLoading}
          variant="primary"
          fullWidth
          className={s.button}
        >
          {isLoading ? 'Loading...' : 'Select from Computer'}
        </Button>

        {preview ? (
          <Button
            onClick={handleContinue}
            variant="primary"
            fullWidth
            className={s.button}
            startIcon={<FiUpload />}
          >
            Continue
          </Button>
        ) : (
          <Button variant="outline" fullWidth className={s.button}>
            Open Draft
          </Button>
        )}
      </div>
    </div>
  )
}
