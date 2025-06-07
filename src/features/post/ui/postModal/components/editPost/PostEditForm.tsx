'use client'

import { Post } from '@/features/post/types/postTypes'
import { Button, PublicationDescription } from '@/shared/ui'
import { User, UserCard } from '@/shared/ui/userCard'
import { useEffect, useState } from 'react'
import { usePostEditHandler } from './usePostEditHandler'

import s from './PostEditForm.module.scss'

type Props = {
  user: User
  defaultDescription: string
  postId: number
  onCancelEdit: () => void
  onSaveEdit: (updatedPost: Post) => void
  onFormChange: (hasChanges: boolean) => void
}

export const PostEditForm = ({ user, defaultDescription, postId, onCancelEdit, onSaveEdit, onFormChange }: Props) => {
  const [description, setDescription] = useState(defaultDescription)
  const { handleEditPost, isLoading } = usePostEditHandler()

  useEffect(() => {
    const hasChanges = description.trim() !== defaultDescription.trim()
    onFormChange(hasChanges)
  }, [description, defaultDescription, onFormChange])

  const handleSave = () => {
    handleEditPost({
      postId,
      description,
      onSuccess: onSaveEdit,
    })
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
