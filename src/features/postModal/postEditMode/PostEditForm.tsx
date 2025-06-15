'use client'

import { UserCard } from '@/entities/user'
import { User } from '@/entities/user/types/userTypes'
import { Button, PublicationDescription } from '@/shared/ui'
import { useEffect, useState } from 'react'

import s from './PostEditForm.module.scss'

type Props = {
  user: User
  initialDescription: string
  postId: number
  onCancelEdit: () => void
  onFormChange: (hasChanges: boolean) => void
  onSave: (postId: number, description: string) => Promise<void>
  isSaving: boolean
}

export const PostEditForm = ({
  user,
  initialDescription,
  postId,
  onCancelEdit,
  onSave,
  isSaving,
  onFormChange,
}: Props) => {
  const [description, setDescription] = useState(initialDescription)

  useEffect(() => {
    const hasChanges = description.trim() !== initialDescription.trim()
    onFormChange(hasChanges)
  }, [description, initialDescription, onFormChange])

  const handleSave = async () => {
    await onSave(postId, description)
  }

  return (
    <div className={s.editForm}>
      <UserCard user={user} className={s.userCard} />
      <PublicationDescription
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isSaving}
      />

      <div className={s.actionButtons}>
        <Button variant="outline" onClick={onCancelEdit} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          Save Changes
        </Button>
      </div>
    </div>
  )
}
