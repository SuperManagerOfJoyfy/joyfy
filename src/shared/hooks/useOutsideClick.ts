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
  const { enabled = true, capture = true } = options
  const ref = useRef<T | null>(null)

  useEffect(() => {
    if (!enabled) return

    const listener = (event: Event) => {
      const target = event.target as Node
      if (!ref.current || ref.current.contains(target)) {
        return
      }

      handler(event)
    }

    const eventNames = ['mousedown', 'touchstart']

    eventNames.forEach((eventName) => {
      document.addEventListener(eventName, listener, { capture })
    })

    return () => {
      eventNames.forEach((eventName) => {
        document.removeEventListener(eventName, listener, { capture })
      })
    }
  }, [handler, enabled, capture])

  return { ref }
}
