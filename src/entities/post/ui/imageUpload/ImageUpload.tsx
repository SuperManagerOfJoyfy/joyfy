'use client'

import { useCallback, ReactNode } from 'react'
import { useDropzone } from 'react-dropzone'

import { toast } from 'react-toastify'

export type ImageUploadProps = {
  onFilesSelected: (files: File[]) => void
  children: (props: {
    getRootProps: ReturnType<typeof useDropzone>['getRootProps']
    getInputProps: ReturnType<typeof useDropzone>['getInputProps']
    open: () => void
    isDragActive: boolean
  }) => ReactNode
  maxFileSize?: number
  maxImages?: number
  acceptedTypes?: string[]
  validateCurrentCount?: number
  noClick?: boolean
}
export const ImageUpload = ({
  onFilesSelected,
  children,
  maxFileSize = 5,
  maxImages = 10,
  acceptedTypes = ['image/jpeg', 'image/png'],
  validateCurrentCount = 0,
  noClick = false,
}: ImageUploadProps) => {
  const validateFile = useCallback(
    (file: File): string | null => {
      if (!acceptedTypes.includes(file.type)) {
        return `The photo must be one of these types: ${acceptedTypes.join(', ')}`
      }
      if (file.size > maxFileSize * 1024 * 1024) {
        return `The photo must be less than ${maxFileSize} MB`
      }
      return null
    },
    [acceptedTypes, maxFileSize]
  )

  const validateImageCount = useCallback(
    (currentCount: number, newCount: number): string | null => {
      if (currentCount + newCount > maxImages) {
        return `You can only upload a maximum of ${maxImages} images`
      }
      return null
    },
    [maxImages]
  )

  const handleDropFiles = useCallback(
    (acceptedFiles: File[]) => {
      const countError = validateImageCount(validateCurrentCount, acceptedFiles.length)
      if (countError) {
        toast.error(countError)
        return
      }

      let errorFound = false
      const validFiles: File[] = []

      for (const file of acceptedFiles) {
        const errorMessage = validateFile(file)
        if (errorMessage) {
          toast.error(errorMessage)
          errorFound = true
          break
        }
        validFiles.push(file)
      }

      if (!errorFound && validFiles.length > 0) {
        onFilesSelected(validFiles)
      }
    },
    [validateFile, validateImageCount, onFilesSelected, validateCurrentCount]
  )

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    maxSize: maxFileSize * 1024 * 1024,
    onDrop: handleDropFiles,
    onDropRejected: (rejections) => {
      const errorMessage = rejections[0]?.errors[0]?.message || 'Invalid file'
      toast.error(errorMessage)
    },
    multiple: true,
    maxFiles: maxImages,
    noClick,
  })

  return children({
    getRootProps,
    getInputProps,
    open,
    isDragActive,
  })
}
