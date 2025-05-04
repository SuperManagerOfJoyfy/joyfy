'use client'

import { FiCamera } from 'react-icons/fi'

import { Button, Typography } from '@/shared/ui'
import { ImageUpload } from '@/entities/post/ui/imageUpload'

import s from './FullImageUpload.module.scss'

export type FullImageUploadProps = {
  onFilesSelected: (files: File[]) => void
  placeholder?: string
  dragPlaceholder?: string
  primaryButtonText?: string
  draftButtonText?: string
  showDraftButton?: boolean
  onDraftClick?: () => void
  className?: string
  dropzoneClassName?: string
  placeholderClassName?: string
  iconClassName?: string
  textClassName?: string
  buttonsClassName?: string
  buttonClassName?: string
  icon?: React.ReactNode
  maxFileSize?: number
  maxImages?: number
  acceptedTypes?: string[]
  validateCurrentCount?: number
}

export const FullImageUpload = ({
  onFilesSelected,
  placeholder = 'Drag and drop your image here or click to browse',
  dragPlaceholder = 'Drop the image here',
  primaryButtonText = 'Select from Computer',
  draftButtonText = 'Open Draft',
  showDraftButton = false,
  onDraftClick,
  className,
  dropzoneClassName,
  placeholderClassName,
  iconClassName,
  textClassName,
  buttonsClassName,
  buttonClassName,
  icon,
  maxFileSize,
  maxImages,
  acceptedTypes,
  validateCurrentCount,
}: FullImageUploadProps) => {
  const uploadIcon = icon || <FiCamera size={48} />

  return (
    <ImageUpload
      onFilesSelected={onFilesSelected}
      maxFileSize={maxFileSize}
      maxImages={maxImages}
      acceptedTypes={acceptedTypes}
      validateCurrentCount={validateCurrentCount}
    >
      {({ getRootProps, getInputProps, open, isDragActive }) => (
        <div className={`${s.container} ${className || ''}`}>
          <div
            {...getRootProps()}
            className={`${s.dropzone} ${isDragActive ? s.dragging : ''} ${dropzoneClassName || ''}`}
          >
            <input {...getInputProps()} aria-label="Upload photo" />
            <div className={`${s.placeholder} ${placeholderClassName || ''}`}>
              <div className={`${s.icon} ${iconClassName || ''}`}>{uploadIcon}</div>
              <Typography variant="body2" className={`${s.dropText} ${textClassName || ''}`}>
                {isDragActive ? dragPlaceholder : placeholder}
              </Typography>
            </div>
          </div>

          <div className={`${s.buttons} ${buttonsClassName || ''}`}>
            <Button onClick={open} variant="primary" fullWidth className={`${s.button} ${buttonClassName || ''}`}>
              {primaryButtonText}
            </Button>

            {showDraftButton && onDraftClick && (
              <Button
                onClick={onDraftClick}
                variant="outline"
                fullWidth
                className={`${s.button} ${buttonClassName || ''}`}
              >
                {draftButtonText}
              </Button>
            )}
          </div>
        </div>
      )}
    </ImageUpload>
  )
}
