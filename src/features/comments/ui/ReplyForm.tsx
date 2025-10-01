import { useState } from 'react'
import { Button, TextArea } from '@/shared/ui'
import { useCreateCommentAnswerMutation } from '@/features/comments/api/commentsApi'
import { PAGINATION_DEFAULTS } from '../utils/constant'
import { useTranslations } from 'next-intl'

type ReplyFormProps = {
  postId: number
  commentId: number
  onCancel: () => void
  className?: string
  actionsClassName?: string
}

export const ReplyForm = ({ postId, commentId, onCancel, className, actionsClassName }: ReplyFormProps) => {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createAnswer] = useCreateCommentAnswerMutation()
  const t = useTranslations('comments')

  const handleSubmit = async () => {
    if (!content.trim()) return
    const answerContent = content.trim()
    setContent('')
    setIsSubmitting(true)
    try {
      await createAnswer({ postId, commentId, content: answerContent }).unwrap()
      onCancel()
    } catch (error) {
      console.error('Error creating answer:', error)
      setContent(answerContent)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && content.trim() && !isSubmitting) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const isDisabled = !content.trim() || isSubmitting

  return (
    <div className={className}>
      <TextArea
        placeholder={t('reply.placeholder')}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyPress={handleKeyPress}
        maxLength={PAGINATION_DEFAULTS.COMMENT_MAX_LENGTH}
        disabled={isSubmitting}
      />
      <div className={actionsClassName}>
        <Button variant="text" onClick={onCancel} noPadding disabled={isSubmitting} className="replyButton">
          {t('reply.cancel')}
        </Button>
        <Button variant="text" onClick={handleSubmit} disabled={isDisabled} noPadding className="replyButton">
          {isSubmitting ? t('form.publishing') : t('form.publish')}
        </Button>
      </div>
    </div>
  )
}
