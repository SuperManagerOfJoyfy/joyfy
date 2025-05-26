'use client'

import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch } from '@/app/store/store'
import { PostsGrid } from '@/entities/post/ui/postsGrid/PostsGrid'
import { postsApi, useGetPostsQuery } from '@/features/post/api/postsApi'
import { GetPostsResponse } from '@/features/post/api/postsApi.types'
import { Post } from '@/features/post/types/types'
import { Loader } from '@/shared/ui/loader/Loader'

type Props = {
  initialPosts: GetPostsResponse
  userId: number
}

export const PostsGridWithInfiniteScroll = ({ initialPosts, userId }: Props) => {
  const dispatch = useAppDispatch()
  const loaderRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const params = useParams()
  const [endCursorPostId, setEndCursorPostId] = useState<number | undefined>(undefined)

  const { data, isFetching, isLoading } = useGetPostsQuery({
    userId,
    endCursorPostId,
  })

  /** Гидратация кэша с initialPosts */
  useEffect(() => {
    if (initialPosts.items.length > 0) {
      dispatch(postsApi.util.upsertQueryData('getPosts', { userId }, initialPosts))
    }
  }, [dispatch, initialPosts, userId])

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

  const openPostModal = (post: Post) => {
    const profileId = params.id || userId

    router.push(`/profile/${profileId}/post/${post.id}`, { scroll: false })
  }

  return (
    <>
      {<PostsGrid posts={data?.items || []} isLoading={isLoading} onPostClick={openPostModal} />}
      {hasMore && (
        <div ref={loaderRef}>
          <Loader reduced />
        </div>
      )}
    </>
  )
}
