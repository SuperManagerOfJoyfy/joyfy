'use client'

import { FiPlus } from 'react-icons/fi'

import { Button } from '@/shared/ui'
import { ImageUpload } from '@/entities/post/ui/imageUpload'

export type ImageUploadButtonProps = {
  onFilesSelected: (files: File[]) => void
  className?: string
  buttonClassName?: string
  icon?: React.ReactNode
  iconSize?: number
  maxFileSize?: number
  maxImages?: number
  acceptedTypes?: string[]
  validateCurrentCount?: number
}

export const ImageUploadButton = ({
  onFilesSelected,
  className,
  buttonClassName,
  icon,
  iconSize = 20,
  maxFileSize,
  maxImages,
  acceptedTypes,
  validateCurrentCount,
}: ImageUploadButtonProps) => {
  const buttonIcon = icon || <FiPlus size={iconSize} />

  return (
    <ImageUpload
      onFilesSelected={onFilesSelected}
      maxFileSize={maxFileSize}
      maxImages={maxImages}
      acceptedTypes={acceptedTypes}
      validateCurrentCount={validateCurrentCount}
      noClick={true}
    >
      {({ getInputProps, open }) => (
        <div>
          <input {...getInputProps()} aria-label="Upload photo" />
          <Button variant="icon" onClick={open}>
            {buttonIcon}
          </Button>
        </div>
      )}
    </ImageUpload>
  )
}
