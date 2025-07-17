import { useEffect, useRef } from 'react'
import { useIntersectionObserver } from '@/shared/hooks/useIntersectionObserver'
import s from './Notification.module.scss'

export const NotificationsLoader = ({ onLoadMore, hasMore }: { onLoadMore: () => Promise<void>; hasMore: boolean }) => {
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

  return <div ref={loaderRef} style={{ height: 1 }} className={s.loader} />
}
