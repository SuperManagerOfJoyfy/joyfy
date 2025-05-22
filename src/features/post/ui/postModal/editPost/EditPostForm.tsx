'use client'

import { useState } from 'react'
import { useEditPostMutation } from '@/features/post/api/postsApi'
import { Post } from '@/features/post/types/types'
import { Button, Loader, PublicationDescription } from '@/shared/ui'
import { User, UserCard } from '@/shared/ui/userCard'

import s from './EditPostForm.module.scss'

type Props = {
  user: User
  defaultDescription: string
  postId: number
  onCancelEdit: () => void
  onSaveEdit: (updatedPost: Post) => void
}

export const EditPostForm = ({ user, defaultDescription, postId, onCancelEdit, onSaveEdit }: Props) => {
  const [description, setDescription] = useState(defaultDescription)
  const [editPost, { isLoading }] = useEditPostMutation()

  const handleSave = async () => {
    try {
      const updatedPost = await editPost({ postId, description }).unwrap()
      onSaveEdit(updatedPost)
    } catch (error) {}
  }

  {
    isLoading && <Loader reduced />
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
