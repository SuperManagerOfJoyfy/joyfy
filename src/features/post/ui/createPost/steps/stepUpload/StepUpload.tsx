'use client'

import { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiCamera, FiPlus } from 'react-icons/fi'
import { IoClose } from 'react-icons/io5'
import { Button, Typography } from '@/shared/ui'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { ACCEPTED_TYPES, MAX_FILE_SIZE_MB, MAX_IMAGES } from '@/features/post/utils/constats'
import { toast } from 'react-toastify'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import s from './StepUpload.module.scss'

type StepUploadProps = {
  onClose: () => void
  onNext: (files: File[]) => void
  hasDraft?: boolean
  error: string | null
  setError: (error: string | null) => void
}

export const StepUpload = ({ onClose, onNext, hasDraft = false, error, setError }: StepUploadProps) => {
  const [previews, setPreviews] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isDragActive, setIsDragActive] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null)

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
        return
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
    },
    [selectedFiles.length, validateFile, setError]
  )

  const {
    getRootProps,
    getInputProps,
    open: openFileDialog,
  } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    onDrop: processFiles,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: (rejections) => {
      setIsDragActive(false)
      const errorMessage = rejections[0]?.errors[0]?.message || 'Invalid file'
      setError(errorMessage)
      toast.error(errorMessage)
    },
    multiple: true,
    maxFiles: MAX_IMAGES,
    noClick: true,
  })

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

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex)
  }

  const handleAddMore = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      openFileDialog()
    },
    [openFileDialog]
  )

  return (
    <div className={s.container}>
      {selectedFiles.length === 0 ? (
        <>
          <div
            {...getRootProps()}
            className={`${s.dropzone} ${isDragActive ? s.dragging : ''}`}
            onClick={openFileDialog}
          >
            <input {...getInputProps()} aria-label="Upload photo" />
            <div className={s.placeholder}>
              <FiCamera size={48} className={s.icon} />
              <Typography variant="body2" className={s.dropText}>
                {isDragActive ? 'Drop the image here' : 'Drag and drop your image here or click to browse'}
              </Typography>
            </div>
          </div>

          {error && (
            <Typography variant="body2" className={s.error}>
              {error}
            </Typography>
          )}

          <div className={s.buttons}>
            <Button onClick={openFileDialog} variant="primary" fullWidth className={s.button}>
              Select from Computer
            </Button>

            {hasDraft && (
              <Button onClick={openDraft} variant="outline" fullWidth className={s.button}>
                Open Draft
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          <div className={s.sliderContainer}>
            {previews.length > 0 && (
              <Swiper
                modules={[Navigation, Pagination]}
                onSwiper={setSwiperInstance}
                initialSlide={activeIndex}
                onSlideChange={handleSlideChange}
                className={s.swiper}
                navigation={true}
                pagination={{
                  clickable: true,
                  type: 'bullets',
                  enabled: true,
                  bulletActiveClass: 'swiper-pagination-bullet-active blue-dot',
                }}
              >
                {previews.map((src, index) => (
                  <SwiperSlide key={`slide-${index}`}>
                    <div className={s.imageWrapper}>
                      <Image src={src} alt={`Image ${index + 1}`} width={490} height={503} className={s.preview} />
                      <Button
                        variant="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeImage(index)
                        }}
                        className={s.removeButton}
                        aria-label="Remove image"
                      >
                        X
                      </Button>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}

            {selectedFiles.length < MAX_IMAGES && (
              <Button
                variant="outline"
                onClick={handleAddMore}
                className={s.addMoreButton}
                aria-label="Add more images"
              >
                <FiPlus size={20} />
                <span>Add more</span>
              </Button>
            )}

            {error && (
              <Typography variant="body2" className={s.error}>
                {error}
              </Typography>
            )}
          </div>

          <div className={s.buttons}>
            <Button
              onClick={handleContinue}
              variant="primary"
              fullWidth
              className={s.button}
              disabled={selectedFiles.length === 0}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
