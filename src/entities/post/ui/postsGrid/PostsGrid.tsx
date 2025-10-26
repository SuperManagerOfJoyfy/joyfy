'use client'

import { Post } from '@/features/post/types/postTypes'
import { useTranslations } from 'next-intl'
import s from './PostsGrid.module.scss'
import { useCallback } from 'react'
import { PostGridItem } from '@/entities/post/ui/postsGrid/PostGridItem'

type Props = {
  posts: Post[] | undefined
  onPostClick: (post: Post) => void
}

export const PostsGrid = ({ onPostClick, posts }: Props) => {
  const t = useTranslations('postsGrid')

  if (!posts || posts.length === 0) {
    return <div className={s.noPostsMsg}>{t('noPosts')}</div>
  }

  const handleClick = useCallback(
    (post: Post) => {
      onPostClick(post)
    },
    [onPostClick]
  )

  return (
    <div className={s.gridContainer}>
      {posts?.map((post) => <PostGridItem post={post} onPostClick={handleClick} key={post.id} />)}
    </div>
  )
}
