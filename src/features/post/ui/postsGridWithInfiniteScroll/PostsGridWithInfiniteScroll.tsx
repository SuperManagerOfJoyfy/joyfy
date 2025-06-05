'use client'

import { useAppDispatch } from '@/app/store/store'
import { PostsGrid } from '@/entities/post/ui/postsGrid/PostsGrid'
import { postsApi, useLazyGetPostsQuery } from '@/features/post/api/postsApi'
import { GetPostsResponse } from '@/features/post/api/postsApi.types'
import { Post } from '@/features/post/types/types'
import { Loader } from '@/shared/ui/loader/Loader'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from './useDebounce'

type Props = {
  initialPostsData: GetPostsResponse
  userId: number
}

export const PostsGridWithInfiniteScroll = ({ initialPostsData, userId }: Props) => {
  const dispatch = useAppDispatch()
  const loaderRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [trigger] = useLazyGetPostsQuery()

  const isInitializedRef = useRef(false)
  const isFetchingRef = useRef(false)
  const requestQueue = useRef<ReturnType<typeof trigger> | null>(null)

  // Получаем текущие данные из кэша
  const {
    data: cachedData,
    isUninitialized,
    isLoading,
    isFetching,
  } = postsApi.endpoints.getPosts.useQueryState(
    { userId },
    {
      selectFromResult: ({ data, isLoading, isUninitialized, isFetching }) => ({
        data,
        isLoading,
        isFetching,
        isUninitialized,
      }),
    }
  )

  // Инициализируем кэш с initialPosts один раз
  useEffect(() => {
    const shouldInitCache =
      !isInitializedRef.current &&
      isUninitialized &&
      initialPostsData &&
      Array.isArray(initialPostsData.items) &&
      initialPostsData.items.length > 0

    if (shouldInitCache) {
      dispatch(postsApi.util.upsertQueryData('getPosts', { userId }, initialPostsData))
      isInitializedRef.current = true
    }
  }, [dispatch, initialPostsData, userId])

  const posts = cachedData?.items || initialPostsData.items
  console.log('cachedData', cachedData)

  const totalCount = cachedData?.totalCount || initialPostsData.totalCount
  const hasMore = posts ? posts.length < totalCount : false

  const fetchMore = useCallback(async () => {
    if (!hasMore || isFetchingRef.current) return

    isFetchingRef.current = true

    try {
      let lastPostId = posts[posts.length - 1]?.id
      if (!lastPostId) return
      console.log('lastPostId1', lastPostId)

      if (requestQueue.current) {
        await requestQueue.current
      }
      requestQueue.current = trigger({ userId, endCursorPostId: lastPostId })
      await requestQueue.current
    } catch (err) {
      console.error('Ошибка при получении данных:', err)
    } finally {
      isFetchingRef.current = false
      requestQueue.current = null
    }
  }, [hasMore, trigger, userId, posts])

  const debouncedHandleIntersect = useDebounce((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && !isFetchingRef.current) {
      fetchMore()
    }
  }, 100)

  useEffect(() => {
    const observer = new IntersectionObserver(debouncedHandleIntersect, {
      root: null,
      rootMargin: '200px',
      threshold: 0.1,
    })

    const el = loaderRef.current
    if (el) observer.observe(el)

    return () => {
      if (el) observer.unobserve(el)
    }
  }, [fetchMore])

  const openPostModal = (post: Post) => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('postId', post.id.toString())
    router.push(`?${newParams.toString()}`, { scroll: false })
  }

  if (!posts?.length && !isLoading) {
    return <div>Нет постов для отображения</div>
  }

  return (
    <>
      {<PostsGrid posts={posts} isLoading={isLoading} onPostClick={openPostModal} />}
      {hasMore && (
        <div ref={loaderRef}>
          <Loader reduced />
        </div>
      )}
    </>
  )
}
