'use client'

import { KeyboardEvent, useState } from 'react'

import { Button, TextArea } from '@/shared/ui'
import { useCreateCommentMutation } from '@/features/comments/api/commentsApi'
import { PAGINATION_DEFAULTS } from '../utils'

import s from './PostComment.module.scss'

type PostCommentFormProps = {
  postId: number
}

export const PostCommentForm = ({ postId }: PostCommentFormProps) => {
  const [content, setContent] = useState('')

  const [createComment, { isLoading }] = useCreateCommentMutation()

  const handleSubmit = async () => {
    if (!content.trim()) return

    const commentContent = content.trim()
    setContent('')

    try {
      await createComment({ postId, content: commentContent }).unwrap()
    } catch (error) {
      console.error('Error creating comment:', error)
      setContent(commentContent)
    }
  }

  const isDisabled = !content.trim() || content.length > PAGINATION_DEFAULTS.COMMENT_MAX_LENGTH

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isDisabled && !isLoading) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className={s.commentForm}>
      <TextArea
        placeholder="Add a Comment..."
        textAreaClassName={s.commentInput}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyPress={handleKeyPress}
        maxLength={PAGINATION_DEFAULTS.COMMENT_MAX_LENGTH}
        disabled={isLoading}
      />
      <Button variant="text" onClick={handleSubmit} disabled={isDisabled || isLoading}>
        {isLoading ? 'Publishing...' : 'Publish'}
      </Button>
    </div>
  )
}
