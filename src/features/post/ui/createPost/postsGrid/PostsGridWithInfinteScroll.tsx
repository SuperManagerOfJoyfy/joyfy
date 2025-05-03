'use client'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useGetAllPostsInfiniteQuery } from '@/features/post/api/postsApi'
import { PostsGrid } from '@/features/post/ui/createPost/postsGrid/PostsGrid'
import { Loader } from '@/shared/ui/loader/Loader'
import { skipToken } from '@reduxjs/toolkit/query'
import { useCallback, useEffect, useRef } from 'react'

export const PostsGridWithInfinteScroll = () => {
  const { user } = useAuth()
  const { data, isLoading, isFetching, hasNextPage, fetchNextPage } = useGetAllPostsInfiniteQuery(
    user ? { userName: user.userName, pageSize: 8 } : skipToken
  )

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
      {<PostsGrid posts={posts} isLoading={isLoading} />}
      {hasNextPage && (
        <div ref={loaderRef}>
          <Loader fullScreen={false} reduced />
        </div>
      )}
    </div>
  )
}
