'use client'

import { useState } from 'react'

import { Comment } from '@/features/comments/api/commentsApi.types'
import { useGetCommentAnswersQuery } from '@/features/comments/api/commentsApi'
import { Button } from '@/shared/ui'
import { mapCommentAuthorToUser } from '../utils'
import { BaseCommentItem } from './BaseCommentItem'
import { AnswerItem } from './AnswerItem'
import { ReplyForm } from './ReplyForm'

import s from './CommentItem.module.scss'

type CommentItemProps = {
  comment: Comment
  postId: number
}

export const CommentItem = ({ comment, postId }: CommentItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [showAnswers, setShowAnswers] = useState(false)

  const { data: answersData } = useGetCommentAnswersQuery({ postId, commentId: comment.id }, { skip: !showAnswers })

  const { id: commentId, createdAt, isLiked, content, likeCount, answerCount, from } = comment

  const user = mapCommentAuthorToUser(from)

  const handleReplyToggle = () => setShowReplyForm(!showReplyForm)
  const handleAnswersToggle = () => setShowAnswers(!showAnswers)
  const handleReplyCancel = () => setShowReplyForm(false)

  return (
    <div className={s.commentWrapper}>
      <BaseCommentItem
        id={commentId}
        postId={postId}
        content={content}
        createdAt={createdAt}
        isLiked={isLiked}
        likeCount={likeCount}
        user={user}
        type="comment"
        commentId={commentId}
        onReply={handleReplyToggle}
        className={s.commentBody}
        contentClassName={s.commentContent}
        metaClassName={s.commentMeta}
      >
        <div className={s.answerActions}>
          {answerCount > 0 && (
            <Button className={s.viewAnswers} onClick={handleAnswersToggle} variant="text" aria-expanded={showAnswers}>
              {showAnswers ? 'Hide' : 'View'} answers ({answerCount})
            </Button>
          )}
        </div>

        {showAnswers && answersData?.items && (
          <div className={s.answers}>
            {answersData.items.map((answer) => (
              <AnswerItem key={answer.id} answer={answer} commentId={commentId} parentUser={user} postId={postId} />
            ))}
          </div>
        )}

        {showReplyForm && (
          <ReplyForm
            postId={postId}
            commentId={commentId}
            onCancel={handleReplyCancel}
            className={s.replyForm}
            actionsClassName={s.replyActions}
          />
        )}
      </BaseCommentItem>
    </div>
  )
}
