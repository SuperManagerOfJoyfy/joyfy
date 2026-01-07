import { Post } from '@/features/post/types/postTypes'
import Image from 'next/image'
import { FaHeart } from 'react-icons/fa'
import { FaComment } from 'react-icons/fa6'
import fallback from './fallbackNoImage.png'
import s from './PostsGrid.module.scss'
import React, { useCallback } from 'react'
import { CommentCount } from '@/features/comments/ui/CommentCount'

type Props = {
  post: Post
  onPostClick: (post: Post) => void
}
export const PostGridItem = React.memo(({ post, onPostClick }: Props) => {
  const handleClick = useCallback(() => onPostClick(post), [onPostClick, post])
  return (
    <div className={s.gridItem} onClick={handleClick}>
      <Image
        src={post.images[0] ? post.images[0].url : fallback}
        alt="post image"
        width={235}
        height={235}
        loading="lazy"
      />
      <div className={s.overlay}>
        <div className={s.likes}>
          <span className={s.likeItem}>
            <FaHeart color="red" />
            <span> {post.likesCount}</span>
          </span>
          <span className={s.likeItem}>
            <FaComment /> <CommentCount postId={post.id} />
          </span>
        </div>
      </div>
    </div>
  )
})
