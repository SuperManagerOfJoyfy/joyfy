import { useIntersectionObserver } from '@/shared/hooks/useIntersectionObserver'
import { useEffect, useRef, useState } from 'react'

export const NotificationsLoader = ({
  onNewPortionLoad,
  hasMore,
}: {
  onNewPortionLoad: () => Promise<void>
  hasMore: boolean
}) => {
  const isLoadingRef = useRef(false)
  const [loaderRef, isLoaderVisible] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0,
    rootMargin: '200px',
  })

  useEffect(() => {
    if (!isLoaderVisible || isLoadingRef.current || !hasMore) return

    isLoadingRef.current = true
    onNewPortionLoad().finally(() => (isLoadingRef.current = false))
  }, [isLoaderVisible, onNewPortionLoad, hasMore])

  return <div ref={loaderRef} style={{ height: '1' }}></div>
}
