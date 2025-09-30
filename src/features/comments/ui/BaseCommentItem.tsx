'use client'

import clsx from 'clsx'
import { ReactNode } from 'react'
import { Button, UserCard } from '@/shared/ui'
import { CommentLikeButton } from './CommentLikeButton'
import { MetaInfo } from './MetaInfo'
import { useTranslations } from 'next-intl'

import s from './BaseCommentItem.module.scss'

type BaseCommentItemProps = {
  id: number
  postId: number
  content: string
  createdAt: string
  isLiked: boolean
  likeCount: number
  user: { id: number; userName: string; avatar: string }
  type: 'comment' | 'answer'
  commentId: number
  answerId?: number
  onReply: () => void
  children?: ReactNode
  className?: string
  contentClassName?: string
  metaClassName?: string
}

export const BaseCommentItem = (props: BaseCommentItemProps) => {
  const {
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
  } = props

  const t = useTranslations('comments')

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
          {t('reply.action')}
        </Button>
      </div>

      {children}
    </div>
  )
}
