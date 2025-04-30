'use client'

import { useCallback, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { StepUploadEmpty } from './StepUploadEmpty'
import { StepUploadWithImages } from './StepUploadWithImages'

import { ACCEPTED_TYPES, MAX_FILE_SIZE_MB, MAX_IMAGES } from '@/features/post/utils/constats'

type StepUploadProps = {
  onClose: () => void
  onNext: (files: File[]) => void
  error: string | null
  setError: (error: string | null) => void
}

export const StepUpload = ({ onClose, onNext, error, setError }: StepUploadProps) => {
  const [previews, setPreviews] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  const cleanupPreviews = useCallback(() => {
    previews.forEach((preview) => {
      if (preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    })
  }, [previews])

  useEffect(() => {
    return cleanupPreviews
  }, [cleanupPreviews])

  const validateFile = useCallback((file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'The photo must be JPEG or PNG'
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `The photo must be less than ${MAX_FILE_SIZE_MB} MB`
    }
    return null
  }, [])

  const processFiles = useCallback(
    (acceptedFiles: File[]) => {
      if (selectedFiles.length + acceptedFiles.length > MAX_IMAGES) {
        setError(`You can only upload a maximum of ${MAX_IMAGES} images`)
        toast.error(`You can only upload a maximum of ${MAX_IMAGES} images`)
        return []
      }

      const validFiles: File[] = []
      const newPreviews: string[] = []
      let errorFound = false

      for (const file of acceptedFiles) {
        const errorMessage = validateFile(file)
        if (errorMessage) {
          setError(errorMessage)
          toast.error(errorMessage)
          errorFound = true
          break
        }

        try {
          const objectUrl = URL.createObjectURL(file)
          validFiles.push(file)
          newPreviews.push(objectUrl)
        } catch (err) {
          console.error('Failed to process file:', err)
          toast.error('Failed to process file')
        }
      }

      if (!errorFound && validFiles.length > 0) {
        setSelectedFiles((prev) => [...prev, ...validFiles])
        setPreviews((prev) => [...prev, ...newPreviews])
        setError(null)
      }

      return validFiles
    },
    [selectedFiles.length, validateFile, setError]
  )

  const removeImage = useCallback(
    (index: number) => {
      if (previews[index] && previews[index].startsWith('blob:')) {
        URL.revokeObjectURL(previews[index])
      }

      setSelectedFiles((prev) => {
        const newFiles = [...prev]
        newFiles.splice(index, 1)
        return newFiles
      })

      setPreviews((prev) => {
        const newPreviews = [...prev]
        newPreviews.splice(index, 1)
        return newPreviews
      })

      if (index <= activeIndex && activeIndex > 0) {
        setActiveIndex(activeIndex - 1)
      }

      toast.info('Image removed')
    },
    [previews, activeIndex]
  )

  const handleContinue = useCallback(() => {
    if (selectedFiles.length > 0) {
      onNext(selectedFiles)
    } else {
      toast.error('Please select at least one image')
    }
  }, [selectedFiles, onNext])

  const openDraft = useCallback(() => {
    toast.info('Draft functionality is limited. Files would need to be stored on the server to be restored.')
  }, [])

  return selectedFiles.length === 0 ? (
    <StepUploadEmpty
      onNext={onNext}
      error={error}
      setError={setError}
      processFiles={processFiles}
      openDraft={openDraft}
    />
  ) : (
    <StepUploadWithImages
      selectedFiles={selectedFiles}
      previews={previews}
      activeIndex={activeIndex}
      setActiveIndex={setActiveIndex}
      removeImage={removeImage}
      processFiles={processFiles}
      onContinue={handleContinue}
      error={error}
    />
  )
}
