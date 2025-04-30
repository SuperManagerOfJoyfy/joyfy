import { AspectRatioType, FilterType, ImageSettings } from '@/features/post/types/types'
import { ACCEPTED_TYPES, MAX_FILE_SIZE_MB, MAX_IMAGES } from '@/features/post/utils/constats'
import { useState, useEffect, useCallback } from 'react'

const IMAGE_SETTINGS_KEY = 'post_image_settings'
const CURRENT_IMAGE_INDEX_KEY = 'post_current_image_index'

export const useImageHandling = (initialFiles: File[] = []) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>(initialFiles)
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [imageSettings, setImageSettings] = useState<ImageSettings[]>([])

  useEffect(() => {
    try {
      const savedSettings = sessionStorage.getItem(IMAGE_SETTINGS_KEY)
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings)
        setImageSettings(parsedSettings)
      }

      const savedCurrentIndex = sessionStorage.getItem(CURRENT_IMAGE_INDEX_KEY)
      if (savedCurrentIndex) {
        setCurrentImageIndex(parseInt(savedCurrentIndex, 10))
      }
    } catch (err) {
      console.error('Failed to load saved image data:', err)
    }
  }, [])

  useEffect(() => {
    if (imageSettings.length > 0) {
      sessionStorage.setItem(IMAGE_SETTINGS_KEY, JSON.stringify(imageSettings))
    } else {
      sessionStorage.removeItem(IMAGE_SETTINGS_KEY)
    }
  }, [imageSettings])

  useEffect(() => {
    sessionStorage.setItem(CURRENT_IMAGE_INDEX_KEY, currentImageIndex.toString())
  }, [currentImageIndex])

  useEffect(() => {
    imagePreviews.forEach((preview) => {
      if (preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    })

    if (selectedFiles.length === 0) return

    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file))
    setImagePreviews(newPreviews)

    if (selectedFiles.length > imageSettings.length) {
      const newSettings = selectedFiles.map((_, index) => {
        if (index < imageSettings.length) {
          return imageSettings[index]
        } else {
          return {
            aspectRatio: '1:1' as AspectRatioType,
            filter: 'Normal' as FilterType,
            zoom: 1,
          }
        }
      })
      setImageSettings(newSettings)
    } else if (selectedFiles.length < imageSettings.length) {
      setImageSettings((prev) => prev.slice(0, selectedFiles.length))
    }

    return () => {
      newPreviews.forEach((preview) => {
        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview)
        }
      })
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
        const newFiles = [...selectedFiles, ...validFiles]
        setSelectedFiles(newFiles)
        setError(null)
      }

      return validFiles
    },
    [selectedFiles, validateFile]
  )

  const removeImage = useCallback(
    (index: number) => {
      if (imagePreviews[index] && imagePreviews[index].startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviews[index])
      }

      setSelectedFiles((prev) => {
        const newFiles = [...prev]
        newFiles.splice(index, 1)
        return newFiles
      })

      setImagePreviews((prev) => {
        const newPreviews = [...prev]
        newPreviews.splice(index, 1)
        return newPreviews
      })

      setImageSettings((prev) => {
        const newSettings = [...prev]
        newSettings.splice(index, 1)
        return newSettings
      })

      if (index <= currentImageIndex && currentImageIndex > 0) {
        const newIndex = currentImageIndex - 1
        setCurrentImageIndex(newIndex)
      }
    },
    [currentImageIndex, imagePreviews]
  )

  const handlePrevImage = useCallback(() => {
    if (currentImageIndex > 0) {
      const newIndex = currentImageIndex - 1
      setCurrentImageIndex(newIndex)
    }
  }, [currentImageIndex])

  const handleNextImage = useCallback(() => {
    if (currentImageIndex < selectedFiles.length - 1) {
      const newIndex = currentImageIndex + 1
      setCurrentImageIndex(newIndex)
    }
  }, [currentImageIndex, selectedFiles.length])

  const updateImageSetting = useCallback((index: number, setting: Partial<ImageSettings>) => {
    setImageSettings((prev) => {
      const newSettings = [...prev]
      if (newSettings[index]) {
        newSettings[index] = { ...newSettings[index], ...setting }
      }
      return newSettings
    })
  }, [])

  const updateCurrentImageSetting = useCallback(
    (setting: Partial<ImageSettings>) => {
      updateImageSetting(currentImageIndex, setting)
    },
    [currentImageIndex, updateImageSetting]
  )

  const clearAllData = useCallback(() => {
    imagePreviews.forEach((preview) => {
      if (preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    })

    setSelectedFiles([])
    setImagePreviews([])
    setImageSettings([])
    setCurrentImageIndex(0)
    setError(null)

    sessionStorage.removeItem(IMAGE_SETTINGS_KEY)
    sessionStorage.removeItem(CURRENT_IMAGE_INDEX_KEY)
  }, [imagePreviews])

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
    imageSettings,
    setImageSettings,
    updateImageSetting,
    updateCurrentImageSetting,
    clearAllData,
    getCurrentImageSettings: () =>
      imageSettings[currentImageIndex] || {
        aspectRatio: '1:1',
        filter: 'Normal',
        zoom: 1,
      },
  }
}
