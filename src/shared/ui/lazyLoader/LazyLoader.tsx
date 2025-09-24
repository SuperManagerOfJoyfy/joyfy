'use client'

import { useEffect, useRef } from 'react'
import { useIntersectionObserver } from '@/shared/hooks'
import s from './LazyLoader.module.scss'
import { Loader } from '../loader'

type Props = {
  onLoadMore: () => Promise<void>
  hasMore: boolean
  isFetching: boolean
}

export const LazyLoader = ({ onLoadMore, hasMore, isFetching }: Props) => {
  const isLoadingRef = useRef(false)
  const [loaderRef, isLoaderVisible] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0,
    rootMargin: '200px',
  })

  useEffect(() => {
    if (!isLoaderVisible || isLoadingRef.current || !hasMore) return

    isLoadingRef.current = true
    onLoadMore().finally(() => (isLoadingRef.current = false))
  }, [isLoaderVisible, onLoadMore, hasMore])

  if (!hasMore) return null

  return hasMore ? (
    <>
      <div ref={loaderRef} className={s.loader} />
      {isFetching && <Loader reduced />}
    </>
  ) : null
}
