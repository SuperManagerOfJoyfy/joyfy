import { toast } from 'react-toastify'

export const useImageValidation = () => {
  const ACCEPTED_TYPES = ['image/jpeg', 'image/png']
  const MAX_FILE_SIZE_MB = 5
  const MAX_IMAGES = 10

  const validateFile = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('The photo must be JPEG or PNG')
      return 'The photo must be JPEG or PNG'
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`The photo must be less than ${MAX_FILE_SIZE_MB} MB`)
      return `The photo must be less than ${MAX_FILE_SIZE_MB} MB`
    }
    return null
  }

  const validateImageCount = (currentCount: number, newCount: number) => {
    if (currentCount + newCount > MAX_IMAGES) {
      toast.error(`You can only upload a maximum of ${MAX_IMAGES} images`)
      return `You can only upload a maximum of ${MAX_IMAGES} images`
    }
    return null
  }

  return {
    validateFile,
    validateImageCount,
    ACCEPTED_TYPES,
    MAX_FILE_SIZE_MB,
    MAX_IMAGES,
  }
}
