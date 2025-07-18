import { useState } from 'react'

import { Button, TextArea } from '@/shared/ui'
import { useCreateCommentAnswerMutation } from '@/features/comments/api/commentsApi'
import { PAGINATION_DEFAULTS } from '../utils/constant'

type ReplyFormProps = {
  postId: number
  commentId: number
  onCancel: () => void
  className?: string
  actionsClassName?: string
}

export const ReplyForm = ({ postId, commentId, onCancel, className, actionsClassName }: ReplyFormProps) => {
  const [content, setContent] = useState('')

  const [createAnswer, { isLoading }] = useCreateCommentAnswerMutation()

  const handleSubmit = async () => {
    if (!content.trim()) return

    const answerContent = content.trim()
    setContent('')

    try {
      await createAnswer({ postId, commentId, content: answerContent }).unwrap()
      onCancel()
    } catch (error) {
      console.error('Error creating answer:', error)
      setContent(answerContent)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && content.trim() && !isLoading) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const isDisabled = !content.trim() || isLoading

  return (
    <div className={className}>
      <TextArea
        placeholder="Write an answer..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyPress={handleKeyPress}
        maxLength={PAGINATION_DEFAULTS.COMMENT_MAX_LENGTH}
        disabled={isLoading}
      />
      <div className={actionsClassName}>
        <Button variant="text" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="text" onClick={handleSubmit} disabled={isDisabled}>
          {isLoading ? 'Publishing...' : 'Publish'}
        </Button>
      </div>
    </div>
  )
}
