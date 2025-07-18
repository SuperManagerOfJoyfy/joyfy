import { LikeButton } from '@/entities/post/ui/likeButton'
import { useLikeToggle } from '../hooks/useLikeToggle'

type CommentLikeButtonProps = {
  type: 'comment' | 'answer'
  postId: number
  isLiked: boolean
  commentId: number
  answerId?: number
  className?: string
  iconClassName?: string
}

export const CommentLikeButton = ({
  type,
  postId,
  isLiked,
  commentId,
  answerId,
  className,
  iconClassName,
}: CommentLikeButtonProps) => {
  const { handleLikeToggle, isLoading } = useLikeToggle({
    type,
    postId,
    isLiked,
    commentId,
    answerId,
  })

  return (
    <LikeButton
      isLiked={isLiked}
      onClick={handleLikeToggle}
      disabled={isLoading}
      className={className}
      iconClassName={iconClassName}
    />
  )
}
