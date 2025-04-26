'use client'

import { useState } from 'react'
import { Button, Typography } from '@/shared/ui'
import { useCreatePost } from '@/features/post/hooks/useCreatePost'

import s from './StepDescription.module.css'
import { AspectRatioType, FilterType } from '@/features/post/types/types'

type StepDescriptionProps = {
  files: File[]
  aspectRatio: AspectRatioType
  zoom: number
  filter: FilterType
  onBack: () => void
  onPublish: (files: File[], description: string) => void
}

export const StepDescription = ({
  files,
  aspectRatio,
  zoom,
  filter,
  onBack,
  onPublish,
}: StepDescriptionProps) => {
  const [description, setDescription] = useState('')
  const { handlePublishPost, isLoading, error } = useCreatePost()

  const handlePublishClick = async () => {
    try {
      await handlePublishPost(files, description, aspectRatio, filter)
      onPublish(files, description)
    } catch (err) {
      console.error('Failed to publish post:', err)
    }
  }

  return (
    <div className={s.container}>
      <div className={s.content}>
        <div className={s.previewContainer}>
          {files.length > 0 && (
            <div className={s.imagePreview}>
              <img src={URL.createObjectURL(files[0])} alt="Preview" />
            </div>
          )}
        </div>

        <div className={s.formContainer}>
          <div className={s.descriptionContainer}>
            <Typography variant="caption">Description</Typography>
            <textarea
              className={s.textarea}
              placeholder="Add a description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={6}
            />
            <div className={s.charCount}>
              <Typography variant="caption">
                {description.length}/500
              </Typography>
            </div>
          </div>

          {error && (
            <Typography variant="body2" className={s.error}>
              {error}
            </Typography>
          )}

          <div className={s.buttons}>
            <Button
              onClick={onBack}
              variant="outline"
              fullWidth
              disabled={isLoading}
            >
              Back
            </Button>
            <Button
              onClick={handlePublishClick}
              variant="primary"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
