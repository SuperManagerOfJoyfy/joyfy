'use client'

import { PostsGrid } from '@/entities/post/ui/postsGrid/PostsGrid'
import { useGetAllPostsInfiniteQuery } from '@/features/post/api/postsApi'
import { Post } from '@/features/post/types/types'
import { Loader } from '@/shared/ui/loader/Loader'
import { skipToken } from '@reduxjs/toolkit/query'
import { useCallback, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export const PostsGridWithInfiniteScroll = ({ userName }: { userName: string }) => {
  const token = localStorage.getItem('accessToken') // skipToken ниже не срабатывает ибо user не null при логауте
  const { data, isLoading, isFetching, hasNextPage, fetchNextPage } = useGetAllPostsInfiniteQuery(
    token ? { userName, pageSize: 8 } : skipToken
  )
  const router = useRouter()
  const searchParams = useSearchParams()

  const postId = searchParams.get('postId')

  console.log(postId)

  const openModalHandler = (post: Post) => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('postId', post.id.toString())
    router.push(`?${newParams.toString()}`, { scroll: false })
  }

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
      {<PostsGrid posts={posts} isLoading={isLoading} onPostClick={openModalHandler} />}
      {hasNextPage && (
        <div ref={loaderRef}>
          <Loader fullScreen={false} reduced />
        </div>
      )}
    </div>
  )
}
