import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Post } from '@/features/post/types/postTypes'
import { favoritesUtils } from '../utils/favoritesUtils'

declare global {
  interface WindowEventMap {
    favoritesChanged: CustomEvent<Post[]>
  }
}

export const useFavorites = () => {
  const [favoritesPosts, setFavoritesPosts] = useState<Post[]>([])
  const router = useRouter()

  const closeModalIfNeeded = useCallback(
    (postId?: number) => {
      const currentParams = new URLSearchParams(window.location.search)
      const currentPostId = currentParams.get('postId')

      if (currentPostId && (!postId || parseInt(currentPostId) === postId)) {
        currentParams.delete('postId')
        const newUrl = currentParams.toString() ? `?${currentParams.toString()}` : window.location.pathname
        router.replace(newUrl, { scroll: false })
      }
    },
    [router]
  )

  const syncFavoritesAndMaybeCloseModal = useCallback(
    (newFavorites: Post[]) => {
      setFavoritesPosts(newFavorites)

      const currentParams = new URLSearchParams(window.location.search)
      const currentPostId = currentParams.get('postId')

      if (currentPostId) {
        const postExists = newFavorites.some((post) => post.id === parseInt(currentPostId))
        if (!postExists) {
          closeModalIfNeeded()
        }
      }
    },
    [closeModalIfNeeded]
  )

  useEffect(() => {
    setFavoritesPosts(favoritesUtils.getFavorites())

    const handleFavoritesChange = (event: CustomEvent<Post[]>) => {
      syncFavoritesAndMaybeCloseModal(event.detail)
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'favoritesPosts') {
        const newFavorites = favoritesUtils.getFavorites()
        syncFavoritesAndMaybeCloseModal(newFavorites)
      }
    }

    window.addEventListener('favoritesChanged', handleFavoritesChange)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('favoritesChanged', handleFavoritesChange)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [syncFavoritesAndMaybeCloseModal])

  const toggleFavorite = useCallback(
    (post: Post): 'added' | 'removed' => {
      return favoritesUtils.toggleFavorite(post, () => closeModalIfNeeded(post.id))
    },
    [closeModalIfNeeded]
  )

  return {
    favoritesPosts,
    toggleFavorite,
  }
}
