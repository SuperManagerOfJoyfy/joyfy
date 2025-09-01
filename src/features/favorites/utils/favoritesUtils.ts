import { Post } from '@/features/post/types/postTypes'

const FAVORITES_KEY = 'favoritesPosts'
const FAVORITES_CHANGED_EVENT = 'favoritesChanged'

const isBrowser = typeof window !== 'undefined'

export const favoritesUtils = {
  getFavorites: (): Post[] => {
    if (!isBrowser) return []

    try {
      const saved = localStorage.getItem(FAVORITES_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  },

  saveFavorites: (posts: Post[]): void => {
    if (!isBrowser) return

    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(posts))
      window.dispatchEvent(new CustomEvent<Post[]>(FAVORITES_CHANGED_EVENT, { detail: posts }))
    } catch (error) {
      console.error('Error saving favorites:', error)
    }
  },

  isFavorite: (postId: number): boolean => {
    return favoritesUtils.getFavorites().some((post) => post.id === postId)
  },

  addToFavorites: (post: Post): boolean => {
    const favorites = favoritesUtils.getFavorites()

    if (favorites.some((p) => p.id === post.id)) return false

    const newFavorites = [...favorites, post]
    favoritesUtils.saveFavorites(newFavorites)

    return true
  },

  removeFromFavorites: (postId: number): boolean => {
    const favorites = favoritesUtils.getFavorites()
    const newFavorites = favorites.filter((post) => post.id !== postId)

    if (newFavorites.length === favorites.length) return false

    favoritesUtils.saveFavorites(newFavorites)

    return true
  },

  toggleFavorite: (post: Post, closeModal: () => void = () => {}): 'added' | 'removed' => {
    if (favoritesUtils.isFavorite(post.id)) {
      const removed = favoritesUtils.removeFromFavorites(post.id)
      if (removed) closeModal()
      return 'removed'
    } else {
      const added = favoritesUtils.addToFavorites(post)
      if (added) closeModal()
      return 'added'
    }
  },
}
