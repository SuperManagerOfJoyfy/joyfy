'use client'

import { useCallback } from 'react'
import { FaRegBookmark, FaRegHeart, FaHeart, FaBookmark } from 'react-icons/fa'
import { FiSend } from 'react-icons/fi'
import { toast } from 'react-toastify'

import { Likes } from '@/features/post/api'
import { Post } from '@/features/post/types/postTypes'
import { favoritesUtils } from '@/features/favorites/utils/favoritesUtils'
import { Button } from '@/shared/ui'
import { useFavorites } from '@/features/favorites/hooks/useFavorites'
import { MESSAGES } from '@/shared/config/messages'

import s from './PostViewMode.module.scss'

type Props = {
  myLike: boolean
  changeLikeStatus: (action: Likes) => void
  post: Post
}

export const PostReactions = ({ myLike, changeLikeStatus, post }: Props) => {
  const { toggleFavorite } = useFavorites()
  const isFavorite = favoritesUtils.isFavorite(post.id)

  const handleBookmarkClick = useCallback(() => {
    const result = toggleFavorite(post)

    if (result === 'added') {
      toast.success(MESSAGES.FAVORITES.FAVORITES_ADD)
    } else {
      toast.success(MESSAGES.FAVORITES.FAVORITES_DELETE)
    }
  }, [toggleFavorite, post])

  const handleLikeClick = useCallback(() => {
    changeLikeStatus(myLike ? Likes.NONE : Likes.LIKE)
  }, [changeLikeStatus, myLike])

  return (
    <div className={s.postReactions}>
      <div className={s.icons}>
        <div className={s.leftIcons}>
          <Button
            variant="icon"
            onClick={handleLikeClick}
            className={s.iconButton}
            aria-label={myLike ? 'Unlike post' : 'Like post'}
          >
            {myLike ? <FaHeart className={s.redHeart} /> : <FaRegHeart className={s.icon} />}
          </Button>

          <Button variant="icon" className={s.iconButton} aria-label="Share post">
            <FiSend className={s.icon} />
          </Button>
        </div>

        <Button
          variant="icon"
          onClick={handleBookmarkClick}
          className={s.iconButton}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? (
            <FaBookmark className={`${s.icon} ${s.favoriteBookmark}`} />
          ) : (
            <FaRegBookmark className={s.icon} />
          )}
        </Button>
      </div>
    </div>
  )
}
