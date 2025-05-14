'use client'

import { PostsGrid } from '@/entities/post/ui/postsGrid/PostsGrid'
import { useGetAllPostsInfiniteQuery } from '@/features/post/api/postsApi'
import { PostItem } from '@/features/post/types/types'
import { PostModal } from '@/features/post/ui/postModal'
import { Loader } from '@/shared/ui/loader/Loader'
import { skipToken } from '@reduxjs/toolkit/query'
import { useCallback, useEffect, useRef, useState } from 'react'

export const PostsGridWithInfinteScroll = ({ userName }: { userName: string }) => {
  const token = localStorage.getItem('accessToken') // skipToken ниже не срабатывает ибо user не null при логауте
  const { data, isLoading, isFetching, hasNextPage, fetchNextPage } = useGetAllPostsInfiniteQuery(
    token ? { userName, pageSize: 8 } : skipToken
  )

  const [selectedPostId, setSelectedPostId] = useState<number | null>(null)
  const openModal = (post: PostItem) => setSelectedPostId(post.id)
  const closeModal = () => setSelectedPostId(null)

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
      {selectedPostId && <PostModal postId={selectedPostId} onClose={closeModal} open={!!selectedPostId} />}
      {hasNextPage && (
        <div ref={loaderRef}>
          <Loader fullScreen={false} reduced />
        </div>
      )}
    </div>
  )
}
