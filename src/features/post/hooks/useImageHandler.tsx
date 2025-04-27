import { useState, useEffect, useCallback } from 'react'
import { ACCEPTED_TYPES, MAX_FILE_SIZE_MB, MAX_IMAGES } from '../utils/constats'
import { AspectRatioType, FilterType, ImageSettings } from '../types/types'

const IMAGE_PREVIEWS_KEY = 'post_image_previews'
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
      const savedSettings = localStorage.getItem(IMAGE_SETTINGS_KEY)
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings)
        setImageSettings(parsedSettings)
      }

      const savedCurrentIndex = localStorage.getItem(CURRENT_IMAGE_INDEX_KEY)
      if (savedCurrentIndex) {
        setCurrentImageIndex(parseInt(savedCurrentIndex, 10))
      }

      const savedPreviews = sessionStorage.getItem(IMAGE_PREVIEWS_KEY)
      if (savedPreviews) {
        const parsedPreviews = JSON.parse(savedPreviews)
        setImagePreviews(parsedPreviews)
      }
    } catch (err) {
      console.error('Failed to load saved image data:', err)
    }
  }, [])

  useEffect(() => {
    if (imageSettings.length > 0) {
      localStorage.setItem(IMAGE_SETTINGS_KEY, JSON.stringify(imageSettings))
    }
  }, [imageSettings])

  useEffect(() => {
    localStorage.setItem(CURRENT_IMAGE_INDEX_KEY, currentImageIndex.toString())
  }, [currentImageIndex])

  useEffect(() => {
    if (imagePreviews.length > 0) {
      sessionStorage.setItem(IMAGE_PREVIEWS_KEY, JSON.stringify(imagePreviews))
    }
  }, [imagePreviews])

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

        if (newPreviews.length > 0) {
          sessionStorage.setItem(IMAGE_PREVIEWS_KEY, JSON.stringify(newPreviews))
        } else {
          sessionStorage.removeItem(IMAGE_PREVIEWS_KEY)
        }

        return newPreviews
      })

      setImageSettings((prev) => {
        const newSettings = [...prev]
        newSettings.splice(index, 1)

        if (newSettings.length > 0) {
          localStorage.setItem(IMAGE_SETTINGS_KEY, JSON.stringify(newSettings))
        } else {
          localStorage.removeItem(IMAGE_SETTINGS_KEY)
        }

        return newSettings
      })

      if (index <= currentImageIndex && currentImageIndex > 0) {
        const newIndex = currentImageIndex - 1
        setCurrentImageIndex(newIndex)
        localStorage.setItem(CURRENT_IMAGE_INDEX_KEY, newIndex.toString())
      }
    },
    [currentImageIndex, imagePreviews]
  )

  const handlePrevImage = useCallback(() => {
    if (currentImageIndex > 0) {
      const newIndex = currentImageIndex - 1
      setCurrentImageIndex(newIndex)
      localStorage.setItem(CURRENT_IMAGE_INDEX_KEY, newIndex.toString())
    }
  }, [currentImageIndex])

  const handleNextImage = useCallback(() => {
    if (currentImageIndex < selectedFiles.length - 1) {
      const newIndex = currentImageIndex + 1
      setCurrentImageIndex(newIndex)
      localStorage.setItem(CURRENT_IMAGE_INDEX_KEY, newIndex.toString())
    }
  }, [currentImageIndex, selectedFiles.length])

  const updateImageSetting = useCallback((index: number, setting: Partial<ImageSettings>) => {
    setImageSettings((prev) => {
      const newSettings = [...prev]
      if (newSettings[index]) {
        newSettings[index] = { ...newSettings[index], ...setting }
        localStorage.setItem(IMAGE_SETTINGS_KEY, JSON.stringify(newSettings))
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

    localStorage.removeItem(IMAGE_SETTINGS_KEY)
    localStorage.removeItem(CURRENT_IMAGE_INDEX_KEY)
    sessionStorage.removeItem(IMAGE_PREVIEWS_KEY)
  }, [imagePreviews])

  const loadFilesFromBlobUrls = useCallback(async (blobUrls: string[]) => {
    try {
      const files: File[] = []
      for (const url of blobUrls) {
        const response = await fetch(url)
        const blob = await response.blob()
        const filename = url.split('/').pop() || 'image.jpg'
        const file = new File([blob], filename, { type: blob.type })
        files.push(file)
      }
      setSelectedFiles(files)
      return files
    } catch (err) {
      console.error('Failed to load files from blob URLs:', err)
      return []
    }
  }, [])

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
    loadFilesFromBlobUrls,
    getCurrentImageSettings: () =>
      imageSettings[currentImageIndex] || {
        aspectRatio: '1:1',
        filter: 'Normal',
        zoom: 1,
      },
  }
}
