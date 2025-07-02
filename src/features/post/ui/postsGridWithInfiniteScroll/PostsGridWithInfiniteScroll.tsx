'use client'

import { useAppDispatch } from '@/app/store/store'
import { PostsGrid } from '@/entities/post/ui/postsGrid/PostsGrid'
import { postsApi, useLazyGetPostsQuery } from '@/features/post/api/postsApi'
import { GetPostsResponse } from '@/features/post/api/postsApi.types'
import { Post } from '@/features/post/types/postTypes'
import { Loader } from '@/shared/ui/loader/Loader'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/shared/hooks/useDebounce'

type Props = {
  initialPostsData: GetPostsResponse
  userId: number
}

export const PostsGridWithInfiniteScroll = ({ initialPostsData, userId }: Props) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [trigger] = useLazyGetPostsQuery()
  const loaderRef = useRef<HTMLDivElement>(null)
  const isInitializedRef = useRef(false)
  const isFetchingRef = useRef(false)
  const requestQueue = useRef<ReturnType<typeof trigger> | null>(null)

  // Получаем текущие данные из кэша
  const { data: cachedData, isUninitialized } = postsApi.endpoints.getPosts.useQueryState(
    { userId },
    {
      selectFromResult: ({ data, isUninitialized }) => ({
        data,
        isUninitialized, // проверка, делался ли запрос
      }),
    }
  )

  // Инициализация кэша с initialPosts один раз
  useEffect(() => {
    if (initialPostsData?.items?.length && isUninitialized && !isInitializedRef.current) {
      dispatch(postsApi.util.upsertQueryData('getPosts', { userId }, initialPostsData))
      isInitializedRef.current = true
    }
  }, [dispatch, initialPostsData, userId, isUninitialized])

  const posts = useMemo(() => {
    return !isUninitialized && cachedData?.items ? cachedData.items : initialPostsData.items
  }, [cachedData, initialPostsData.items])

  const hasMore = useMemo(() => {
    if (isUninitialized) return true // Если кэш пуст - предполагаем что есть ещё данные
    const total = cachedData?.totalCount ?? initialPostsData.totalCount

    return posts.length < total
  }, [isUninitialized, cachedData, initialPostsData.totalCount, posts.length])

  const fetchMore = useCallback(async () => {
    if (!hasMore || isFetchingRef.current) return

    isFetchingRef.current = true
    try {
      let lastPostId = posts[posts.length - 1]?.id
      if (!lastPostId) return

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
    if (entries[0].isIntersecting) {
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

  return (
    <>
      {<PostsGrid posts={posts} onPostClick={openPostModal} />}
      {hasMore && (
        <div ref={loaderRef}>
          <Loader reduced />
        </div>
      )}
    </>
  )
}
