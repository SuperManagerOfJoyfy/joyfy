'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiCamera } from 'react-icons/fi'
import { Button, Typography } from '@/shared/ui'

import { ACCEPTED_TYPES, MAX_FILE_SIZE_MB, MAX_IMAGES } from '@/features/post/utils/constats'
import { toast } from 'react-toastify'

import s from './StepUpload.module.scss'

type StepUploadEmptyProps = {
  onNext: (files: File[]) => void
  error: string | null
  setError: (error: string | null) => void
  processFiles: (acceptedFiles: File[]) => File[]
  openDraft: () => void
}

export const StepUploadEmpty = ({ onNext, error, setError, processFiles, openDraft }: StepUploadEmptyProps) => {
  const validateFile = useCallback((file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'The photo must be JPEG or PNG'
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `The photo must be less than ${MAX_FILE_SIZE_MB} MB`
    }
    return null
  }, [])

  const handleDropFiles = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > MAX_IMAGES) {
        setError(`You can only upload a maximum of ${MAX_IMAGES} images`)
        toast.error(`You can only upload a maximum of ${MAX_IMAGES} images`)
        return
      }

      let errorFound = false
      for (const file of acceptedFiles) {
        const errorMessage = validateFile(file)
        if (errorMessage) {
          setError(errorMessage)
          toast.error(errorMessage)
          errorFound = true
          break
        }
      }

      if (!errorFound && acceptedFiles.length > 0) {
        const validFiles = processFiles(acceptedFiles)
        if (validFiles.length > 0) {
          onNext(validFiles)
        }
      }
    },
    [validateFile, setError, processFiles, onNext]
  )

  const {
    getRootProps,
    getInputProps,
    open: openFileDialog,
    isDragActive,
  } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    onDrop: handleDropFiles,
    onDropRejected: (rejections) => {
      const errorMessage = rejections[0]?.errors[0]?.message || 'Invalid file'
      setError(errorMessage)
      toast.error(errorMessage)
    },
    multiple: true,
    maxFiles: MAX_IMAGES,
    noClick: false,
  })

  return (
    <div className={s.container}>
      <div {...getRootProps()} className={`${s.dropzone} ${isDragActive ? s.dragging : ''}`}>
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

        <Button onClick={openDraft} variant="outline" fullWidth className={s.button}>
          Open Draft
        </Button>
      </div>
    </div>
  )
}
