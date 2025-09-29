import { UserItem } from '@/features/userSearch/api/usersApi.types'
import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY_PREFIX = 'recentRequests'

function getStorageKey(userId?: number) {
  return userId ? `${STORAGE_KEY_PREFIX}_${userId}` : STORAGE_KEY_PREFIX
}

function loadFromLS(userId?: number): UserItem[] {
  try {
    const key = getStorageKey(userId)
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveToLS(data: UserItem[], userId?: number) {
  const key = getStorageKey(userId)
  localStorage.setItem(key, JSON.stringify(data))
}

export function useRecentRequests(userId?: number, limit = 10) {
  const [recentRequests, setRecentRequests] = useState<UserItem[]>([])

  useEffect(() => {
    setRecentRequests(loadFromLS(userId))
  }, [userId])

  const addRequest = useCallback(
    (user: UserItem) => {
      setRecentRequests((prev) => {
        const exists = prev.some((u) => u.id === user.id)
        if (exists) return prev

        const updated = [user, ...prev].slice(0, limit)
        saveToLS(updated, userId)
        return updated
      })
    },
    [limit]
  )

  return { recentRequests, addRequest }
}
