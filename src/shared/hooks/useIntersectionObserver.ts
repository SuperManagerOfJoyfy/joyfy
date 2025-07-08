import { RefObject, useEffect, useRef, useState } from 'react'
import { useDebounce } from './useDebounce'

export const useIntersectionObserver = <T extends HTMLElement>(
  options?: IntersectionObserverInit
): [RefObject<T | null>, boolean] => {
  const ref = useRef<T>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  const debouncedHandleIntersect = useDebounce((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting) {
      setIsIntersecting(true)
    } else {
      setIsIntersecting(false)
    }
  }, 100)

  useEffect(() => {
    const node = ref.current

    if (!node) return

    const observer = new IntersectionObserver(debouncedHandleIntersect, options)

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [options, ref])

  return [ref, isIntersecting]
}
