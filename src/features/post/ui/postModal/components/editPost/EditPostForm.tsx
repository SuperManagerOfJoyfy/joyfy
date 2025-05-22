'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useEditPostMutation } from '@/features/post/api/postsApi'
import { Post } from '@/features/post/types/types'
import { Button, Loader, PublicationDescription } from '@/shared/ui'
import { User, UserCard } from '@/shared/ui/userCard'
import { extractMessage, isFetchBaseQueryError } from '@/shared/utils/handleErrors/handleErrors'

import s from './EditPostForm.module.scss'

type Props = {
  user: User
  defaultDescription: string
  postId: number
  onCancelEdit: () => void
  onSaveEdit: (updatedPost: Post) => void
  onFormChange: (hasChanges: boolean) => void
}

export const EditPostForm = ({ user, defaultDescription, postId, onCancelEdit, onSaveEdit, onFormChange }: Props) => {
  const [description, setDescription] = useState(defaultDescription)
  const [editPost, { isLoading }] = useEditPostMutation()

  useEffect(() => {
    const hasChanges = description.trim() !== defaultDescription.trim()
    onFormChange(hasChanges)
  }, [description, defaultDescription, onFormChange])

  const handleSave = async () => {
    try {
      const updatedPost = await editPost({ postId, description }).unwrap()
      onSaveEdit(updatedPost)
      toast.success('Post updated successfully!')
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const message = extractMessage(error.data, 'Failed to update the post.')
        toast.error(message)
      } else if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unknown error occurred.')
      }
    }
  }

  return (
    <div className={s.editForm}>
      <UserCard user={user} className={s.userCard} />
      <PublicationDescription
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isLoading}
      />

      <div className={s.actionButtons}>
        <Button variant="outline" onClick={onCancelEdit} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          Save Changes
        </Button>
      </div>
    </div>
  )
}
