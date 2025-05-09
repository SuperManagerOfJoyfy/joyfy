'use client'

import { PostsGrid } from '@/entities/post/ui/postsGrid/PostsGrid'
import { useGetMeQuery } from '@/features/auth/api/authApi'
import { useGetAllPostsInfiniteQuery } from '@/features/post/api/postsApi'
import { PostItem } from '@/features/post/types/types'
import { PostModal } from '@/features/post/ui/postModal'
import { Loader } from '@/shared/ui/loader/Loader'
import { skipToken } from '@reduxjs/toolkit/query'
import { useCallback, useEffect, useRef, useState } from 'react'

export const PostsGridWithInfinteScroll = () => {
  const { data: user } = useGetMeQuery()
  if (!user) return null
  const userId = user.userId

  const token = localStorage.getItem('accessToken') // skipToken ниже не срабатывает ибо user не null при логауте
  const { data, isLoading, isFetching, hasNextPage, fetchNextPage } = useGetAllPostsInfiniteQuery(
    token && user ? { userName: user.userName, pageSize: 8 } : skipToken
  )
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null)
  const openModal = (post: PostItem) => setSelectedPost(post)
  const closeModal = () => setSelectedPost(null)

  const posts = data?.pages.flatMap((page) => page.items) || []
  const loaderRef = useRef<HTMLDivElement>(null)

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && !isFetching && hasNextPage) {
        fetchNextPage()
      }
    },
    [isFetching, hasNextPage]
  )
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 0.1,
    })

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current)
      }
    }
  }, [handleObserver])

  return (
    <div>
      {<PostsGrid posts={posts} isLoading={isLoading} onPostClick={openModal} />}
      {selectedPost && <PostModal post={selectedPost} onClose={closeModal} open={!!selectedPost} userId={userId} />}
      {hasNextPage && (
        <div ref={loaderRef}>
          <Loader fullScreen={false} reduced />
        </div>
      )}
    </div>
  )
}
