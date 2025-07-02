import { useEffect, useRef } from 'react'

type Handler = (event: Event) => void

interface UseOutsideClickOptions {
  enabled?: boolean
  capture?: boolean
}

export function useOutsideClick<T extends HTMLElement>(
  handler: Handler,
  options: UseOutsideClickOptions = {}
): {
  ref: React.RefObject<T | null>
} {
  const { enabled = true, capture = false } = options
  const ref = useRef<T | null>(null)
  const handlerRef = useRef(handler)

  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    if (!enabled) return

    const listener = (event: Event) => {
      const target = event.target as Node

      if (!ref.current || !target) {
        return
      }

      if (!ref.current.contains(target)) {
        handlerRef.current(event)
      }
    }

    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', listener, capture)
    }, 0)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', listener, capture)
    }
  }, [enabled, capture])

  return { ref }
}
