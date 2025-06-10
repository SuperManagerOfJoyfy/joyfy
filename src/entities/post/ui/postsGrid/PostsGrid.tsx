'use client'

import { Post } from '@/features/post/types/postTypes'

import Image from 'next/image'
import { FaHeart } from 'react-icons/fa'
import { FaComment } from 'react-icons/fa6'
import fallback from './fallbackNoImage.png'
import s from './PostsGrid.module.scss'

type Props = {
  posts: Post[] | undefined
  onPostClick: (post: Post) => void
}

export const PostsGrid = ({ onPostClick, posts }: Props) => {
  if (!posts || posts.length === 0) return <div className={s.noPostsMsg}>There are no posts yet</div>

  return (
    <div className={s.gridContainer}>
      {posts?.map((post) => (
        <div className={s.gridItem} onClick={() => onPostClick(post)} key={post.id}>
          <Image
            src={post.images[0] ? post.images[0].url : fallback}
            alt="post image"
            width={235}
            height={235}
            priority
          />
          <div className={s.overlay}>
            <div className={s.likes}>
              <span className={s.likeItem}>
                <FaHeart color="red" />
                <span> {post.likesCount}</span>
              </span>
              <span className={s.likeItem}>
                <FaComment /> <span>0</span>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
