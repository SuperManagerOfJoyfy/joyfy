'use client'

import { useEffect, useState } from 'react'
import { Post } from '@/features/post/types/types'
import { User, UserCard } from '@/shared/ui/userCard'
import { Button, PublicationDescription } from '@/shared/ui'
import { useEditPostHandler } from './useEditPostHandler'

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
  const { handleEditPost, isLoading } = useEditPostHandler()

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
