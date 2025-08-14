'use client'

import { ReactNode } from 'react'
import clsx from 'clsx'

import { MetaInfo } from './MetaInfo'
import { Button } from '@/shared/ui'
import { CommentLikeButton } from './CommentLikeButton'

import s from './BaseCommentItem.module.scss'
import { UserCard } from '@/shared/user'

type BaseCommentItemProps = {
  id: number
  postId: number
  content: string
  createdAt: string
  isLiked: boolean
  likeCount: number
  user: {
    id: number
    userName: string
    avatar: string
  }
  type: 'comment' | 'answer'
  commentId: number
  answerId?: number
  onReply: () => void
  children?: ReactNode
  className?: string
  contentClassName?: string
  metaClassName?: string
}

export const BaseCommentItem = ({
  content,
  createdAt,
  isLiked,
  likeCount,
  user,
  type,
  commentId,
  answerId,
  onReply,
  children,
  className,
  contentClassName,
  metaClassName,
  postId,
}: BaseCommentItemProps) => {
  const contentClass = clsx(s.commentContent, contentClassName)
  const metaClass = clsx(s.metaInfo, metaClassName)
  const rootClass = clsx(s.commentItem, className)

  return (
    <div className={rootClass}>
      <div className={contentClass}>
        <UserCard user={user} layout="inline">
          {content}
        </UserCard>

        <div className={s.iconWrapper}>
          <CommentLikeButton
            type={type}
            postId={postId}
            isLiked={isLiked}
            commentId={commentId}
            answerId={answerId}
            className={s.likeButton}
            iconClassName={s.heartIcon}
          />
        </div>
      </div>

      <div className={metaClass}>
        <MetaInfo createdAt={createdAt} likeCount={likeCount} className={s.metaInfo} likesClassName={s.likes} />

        <Button className={s.replyButton} onClick={onReply} variant="text">
          Answer
        </Button>
      </div>

      {children}
    </div>
  )
}
