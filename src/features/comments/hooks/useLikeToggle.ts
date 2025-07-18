import { useCallback } from 'react'

import {
  useUpdateCommentLikeStatusMutation,
  useUpdateAnswerLikeStatusMutation,
} from '@/features/comments/api/commentsApi'
import { LikeStatus } from '@/features/comments/api/commentsApi.types'

type UseLikeToggleProps = {
  type: 'comment' | 'answer'
  postId: number
  isLiked: boolean
  commentId: number
  answerId?: number
}

export const useLikeToggle = ({ type, postId, isLiked, commentId, answerId }: UseLikeToggleProps) => {
  const [updateCommentLike, { isLoading: isCommentLoading }] = useUpdateCommentLikeStatusMutation()

  const [updateAnswerLike, { isLoading: isAnswerLoading }] = useUpdateAnswerLikeStatusMutation()

  const handleLikeToggle = useCallback(async () => {
    const newLikeStatus: LikeStatus = isLiked ? 'NONE' : 'LIKE'

    if (type === 'answer' && !answerId) return

    try {
      if (type === 'comment') {
        await updateCommentLike({
          postId,
          commentId,
          likeStatus: newLikeStatus,
        }).unwrap()
      } else {
        await updateAnswerLike({
          postId,
          commentId,
          answerId: answerId!,
          likeStatus: newLikeStatus,
        }).unwrap()
      }
    } catch {}
  }, [type, postId, isLiked, commentId, answerId, updateCommentLike, updateAnswerLike])

  return {
    handleLikeToggle,
    isLoading: type === 'comment' ? isCommentLoading : isAnswerLoading,
  }
}
