'use client'

import { useAppDispatch } from '@/app/store/store'
import { PostsGrid } from '@/entities/post/ui/postsGrid/PostsGrid'
import { postsApi, useGetPostsQuery } from '@/features/post/api/postsApi'
import { GetPostsResponse } from '@/features/post/api/postsApi.types'
import { Post } from '@/features/post/types/types'
import { Loader } from '@/shared/ui/loader/Loader'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export const PostsGridWithInfiniteScroll = ({
  initialPosts,
  userId,
}: {
  initialPosts: GetPostsResponse
  userId: number
}) => {
  const [endCursorPostId, setEndCursorPostId] = useState<number | undefined>(undefined)
  const dispatch = useAppDispatch()
  const loaderRef = useRef<HTMLDivElement>(null)

  /** Гидратация кэша с initialPosts */
  useEffect(() => {
    if (initialPosts.items.length > 0) {
      dispatch(postsApi.util.upsertQueryData('getPosts', { userId }, initialPosts))
    }
  }, [dispatch, initialPosts, userId])

  const { data, isFetching, isLoading } = useGetPostsQuery({
    userId,
    endCursorPostId,
  })

  const router = useRouter()
  const searchParams = useSearchParams()

  const openModalHandler = (post: Post) => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('postId', post.id.toString())
    router.push(`?${newParams.toString()}`, { scroll: false })
  }

  const hasMore = data ? data.items.length < data.totalCount : false

  const fetchMore = useCallback(() => {
    if (!hasMore || isFetching) return

    const lastPostId = data?.items.at(-1)?.id
    if (lastPostId) {
      setEndCursorPostId(lastPostId)
    }
  }, [data, isFetching, hasMore])

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && !isFetching && hasMore) {
        fetchMore()
      }
    },
    [isFetching, hasMore, fetchMore]
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
    <>
      {<PostsGrid posts={data?.items || []} isLoading={isLoading} onPostClick={openModalHandler} />}
      {hasMore && (
        <div ref={loaderRef}>
          <Loader fullScreen={false} reduced />
        </div>
      )}
    </>
  )
}
