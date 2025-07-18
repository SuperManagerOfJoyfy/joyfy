'use client'

import { useState } from 'react'

import { Answer } from '@/features/comments/api/commentsApi.types'
import { BaseCommentItem } from './BaseCommentItem'
import { ReplyForm } from './ReplyForm'

import s from './AnswerItem.module.scss'

type UserPreview = {
  id: number
  userName: string
  avatar: string
}

type AnswerItemProps = {
  answer: Answer
  commentId: number
  parentUser?: UserPreview
  postId: number
}

export const AnswerItem = ({ answer, commentId, parentUser, postId }: AnswerItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false)

  const {
    id: answerId,
    createdAt,
    isLiked,
    content,
    likeCount,
    from: { id: userId, userName, avatar },
  } = answer

  const user: UserPreview = {
    id: userId,
    userName: userName || parentUser?.userName || '',
    avatar: avatar || parentUser?.avatar || '',
  }

  const toggleReplyForm = () => setShowReplyForm((prev) => !prev)

  return (
    <BaseCommentItem
      id={answerId}
      postId={postId}
      content={content}
      createdAt={createdAt}
      isLiked={isLiked}
      likeCount={likeCount}
      user={user}
      type="answer"
      commentId={commentId}
      answerId={answerId}
      onReply={toggleReplyForm}
      className={s.answerWrapper}
      contentClassName={s.answerContent}
      metaClassName={s.answerMeta}
    >
      {showReplyForm && (
        <ReplyForm
          commentId={commentId}
          postId={postId}
          onCancel={() => setShowReplyForm(false)}
          className={s.replyForm}
          actionsClassName={s.replyActions}
        />
      )}
    </BaseCommentItem>
  )
}
