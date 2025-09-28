'use client'

import { useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { Typography } from '@/shared/ui'
import { PostsGrid } from '@/entities/post/ui/postsGrid/PostsGrid'
import { Post } from '@/features/post/types/postTypes'
import { PostModal } from '@/features/postModal/ui'
import { useGetMeQuery } from '@/features/auth/api/authApi'
import { useFavorites } from '../hooks/useFavorites'

import s from './Favorites.module.scss'

export const Favorites = () => {
  const t = useTranslations('favorites')
  const { favoritesPosts } = useFavorites()
  const { data: me } = useGetMeQuery()
  const router = useRouter()
  const searchParams = useSearchParams()

  const postId = searchParams.get('postId')

  const selectedPost = useMemo(() => {
    if (!postId) return null
    return favoritesPosts.find((post) => post.id === parseInt(postId)) || null
  }, [postId, favoritesPosts])

  const canShowModal = selectedPost && me

  const openPostModal = (post: Post) => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('postId', post.id.toString())
    router.push(`?${newParams.toString()}`, { scroll: false })
  }

  return (
    <>
      <Typography variant="h1">{t('title', { count: favoritesPosts.length })}</Typography>

      {favoritesPosts.length === 0 ? (
        <div className={s.emptyState}>
          <Typography variant="body1">{t('empty')}</Typography>
        </div>
      ) : (
        <div className={s.posts}>
          <PostsGrid posts={favoritesPosts} onPostClick={openPostModal} />
          {canShowModal && <PostModal userId={me.userId} initialPost={selectedPost!} />}
        </div>
      )}
    </>
  )
}
