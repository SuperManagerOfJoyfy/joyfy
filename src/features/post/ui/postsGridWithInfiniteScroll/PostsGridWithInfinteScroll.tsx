'use client'

import { PostsGrid } from '@/entities/post/ui/postsGrid/PostsGrid'
import { useGetAllPostsInfiniteQuery } from '@/features/post/api/postsApi'
import { PostItem } from '@/features/post/types/types'
import { PostModal } from '@/features/post/ui/postModal'
import { Loader } from '@/shared/ui/loader/Loader'
import { skipToken } from '@reduxjs/toolkit/query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export const PostsGridWithInfinteScroll = ({ userName }: { userName: string }) => {
  const token = localStorage.getItem('accessToken') // skipToken ниже не срабатывает ибо user не null при логауте
  const { data, isLoading, isFetching, hasNextPage, fetchNextPage } = useGetAllPostsInfiniteQuery(
    token ? { userName, pageSize: 8 } : skipToken
  )

  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const postId = params.get('postId')
    if (postId) {
      setIsModalOpen(true)
    }
  }, [searchParams])

  const openModalHandler = (post: PostItem) => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('postId', post.id.toString())
    router.push(`?${newParams.toString()}`, { scroll: false })

    setIsModalOpen(true)
  }

  const closeModalHandler = () => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete('postId')
    router.push(`?${newParams.toString()}`, { scroll: false })

    setIsModalOpen(false)
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

  const postId = searchParams.get('postId')
  return (
    <div>
      {<PostsGrid posts={posts} isLoading={isLoading} onPostClick={openModalHandler} />}
      {isModalOpen && postId && <PostModal onClose={closeModalHandler} open={isModalOpen} />}
      {hasNextPage && (
        <div ref={loaderRef}>
          <Loader fullScreen={false} reduced />
        </div>
      )}
    </div>
  )
}
