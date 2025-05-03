'use client'

import React, { useEffect } from 'react'
import s from './PostsGrid.module.scss'
import Image from 'next/image'
import { PostItem } from '@/features/post/types/types'
import { Loader } from '@/shared/ui/loader/Loader'

type Props = {
  posts: PostItem[]
  onPostClick?: () => void
  isLoading: boolean
}

export const PostsGrid = ({ onPostClick, posts, isLoading }: Props) => {
  if (isLoading) return <Loader />
  if (!posts || posts.length === 0) return <div className={s.noPostsMsg}>There are no posts yet</div>

  return (
    <div className={s.gridContainer}>
      {posts?.map((post) => (
        <div className={s.gridItem} onClick={onPostClick} key={post.id}>
          <Image src={post.images[0].url} alt="post image" width={235} height={228} priority />
        </div>
      ))}
    </div>
  )
}
