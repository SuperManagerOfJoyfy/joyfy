import { useState, useEffect, useCallback } from 'react'
import { ACCEPTED_TYPES, MAX_FILE_SIZE_MB, MAX_IMAGES } from '../utils/constats'

export const useImageHandling = (initialFiles: File[] = []) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>(initialFiles)
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const previews = selectedFiles.map((file) => URL.createObjectURL(file))
    setImagePreviews(previews)

    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview))
    }
  }, [selectedFiles])

  const validateFile = useCallback((file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'The photo must be JPEG or PNG'
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `The photo must be less than ${MAX_FILE_SIZE_MB} MB`
    }
    return null
  }, [])

  const processFiles = useCallback(
    (files: File[]) => {
      if (selectedFiles.length + files.length > MAX_IMAGES) {
        setError(`You can only upload a maximum of ${MAX_IMAGES} images`)
        return []
      }

      const validFiles: File[] = []

      for (const file of files) {
        const errorMessage = validateFile(file)
        if (errorMessage) {
          setError(errorMessage)
          continue
        }
        validFiles.push(file)
      }

      if (validFiles.length > 0) {
        setSelectedFiles((prev) => [...prev, ...validFiles])
        setError(null)
      }

      return validFiles
    },
    [selectedFiles.length, validateFile]
  )

  const removeImage = useCallback(
    (index: number) => {
      setSelectedFiles((prev) => {
        const newFiles = [...prev]
        newFiles.splice(index, 1)
        return newFiles
      })

      if (currentImageIndex >= imagePreviews.length - 1) {
        setCurrentImageIndex(Math.max(0, imagePreviews.length - 2))
      }
    },
    [currentImageIndex, imagePreviews.length]
  )

  const handlePrevImage = useCallback(() => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }, [currentImageIndex])

  const handleNextImage = useCallback(() => {
    if (currentImageIndex < selectedFiles.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
  }, [currentImageIndex, selectedFiles.length])

  return {
    selectedFiles,
    setSelectedFiles,
    imagePreviews,
    currentImageIndex,
    setCurrentImageIndex,
    error,
    setError,
    processFiles,
    removeImage,
    handlePrevImage,
    handleNextImage,
  }
}
