'use client'

import { useAppDispatch } from '@/app/store/store'
import { PostsGrid } from '@/entities/post/ui/postsGrid/PostsGrid'
import { postsApi, useGetPostsQuery } from '@/features/post/api/postsApi'
import { GetPostsResponse } from '@/features/post/api/postsApi.types'
import { PostItem } from '@/features/post/types/types'
import { PostModal } from '@/features/post/ui/postModal'
import { Loader } from '@/shared/ui/loader/Loader'
import { useCallback, useEffect, useRef, useState } from 'react'

export const PostsGridWithInfiniteScroll = ({
  initialPosts,
  userId,
}: {
  initialPosts: GetPostsResponse
  userId: number
}) => {
  const [endCursorPostId, setEndCursorPostId] = useState<number | undefined>(undefined)
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null)
  const openModal = (post: PostItem) => setSelectedPostId(post.id)
  const closeModal = () => setSelectedPostId(null)
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
    <div>
      {<PostsGrid posts={data?.items || []} isLoading={isLoading} onPostClick={openModal} />}
      {selectedPostId && <PostModal postId={selectedPostId} onClose={closeModal} open={!!selectedPostId} />}
      {hasMore && (
        <div ref={loaderRef}>
          <Loader fullScreen={false} reduced />
        </div>
      )}
    </div>
  )
}
