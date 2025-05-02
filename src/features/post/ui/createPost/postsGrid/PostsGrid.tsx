'use client'

import React, { useEffect } from 'react'
import s from './PostsGrid.module.scss'
import Image from 'next/image'
import { PostItem } from '@/features/post/types/types'
import { Loader } from '@/shared/ui/loader/Loader'

type Props = {
  posts: PostItem[]
  onPostClick?: () => void
  loadMorePosts?: () => void
  isFetching?: boolean
  hasNextPage?: boolean
}

export const PostsGrid = ({ onPostClick, posts, loadMorePosts, isFetching, hasNextPage }: Props) => {
  useEffect(() => {
    const handleScroll = () => {
      if (isFetching || !hasNextPage) return

      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMorePosts?.()
      }
    }
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [loadMorePosts, hasNextPage, isFetching])

  return (
    <div>
      <div className={s.gridContainer}>
        {posts?.map((post) => (
          <div className={s.gridItem} onClick={onPostClick} key={post.id}>
            <Image src={post.images[0].url} alt="post image" width={235} height={228} priority />
          </div>
        ))}
      </div>
      {isFetching && (
        <div className={s.loaderContainer}>
          <Loader />
        </div>
      )}
    </div>
  )
}
