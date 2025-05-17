'use client'

import { useState } from 'react'
import { useEditPostMutation } from '@/features/post/api/postsApi'
import { Post } from '@/features/post/types/types'
import { Button, Loader, TextArea, UserCard } from '@/shared/ui'
import { User } from '@/shared/ui/userCard'
import s from './EditPostForm.module.scss'

type Props = {
  user: User
  defaultDescription: string
  postId: number
  onCancel: () => void
  onSave: (updatedPost: Post) => void
}

export const EditPostForm = ({ user, defaultDescription, postId, onCancel, onSave }: Props) => {
  const [description, setDescription] = useState(defaultDescription)
  const [editPost, { isLoading }] = useEditPostMutation()

  const handleSave = async () => {
    try {
      const updatedPost = await editPost({ postId, description }).unwrap()
      onSave(updatedPost)
    } catch (error) {}
  }

  {
    isLoading && <Loader />
  }
  return (
    <div className={s.editForm}>
      <UserCard user={user} className={s.userCard} />
      <TextArea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={s.editTextArea}
        label="Add publication description"
      />
      <div className={s.charCounter}>{description.length} / 500</div>
      <div className={s.actionButtons}>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  )
}
