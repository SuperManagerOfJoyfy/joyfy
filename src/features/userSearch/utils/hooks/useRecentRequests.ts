import { UserItem } from '@/features/userSearch/api/usersApi.types'
import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'recentRequests'

function loadFromLS(): UserItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveToLS(data: UserItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useRecentRequests(limit = 10) {
  const [recentRequests, setRecentRequests] = useState<UserItem[]>([])

  useEffect(() => {
    setRecentRequests(loadFromLS())
  }, [])

  const addRequest = useCallback(
    (user: UserItem) => {
      setRecentRequests((prev) => {
        const exists = prev.some((u) => u.id === user.id)
        if (exists) return prev

        const updated = [user, ...prev].slice(0, limit)
        saveToLS(updated)
        return updated
      })
    },
    [limit]
  )

  return { recentRequests, addRequest }
}
