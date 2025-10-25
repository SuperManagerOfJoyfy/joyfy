'use client'

import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import { useRouter } from '@/i18n/navigation'
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from 'react-icons/fa'
import { FiSend } from 'react-icons/fi'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import { toast } from 'react-toastify'
import clsx from 'clsx'

import { useGetMeQuery } from '@/features/auth/api/authApi'
import { useFavorites } from '@/features/favorites/hooks/useFavorites'
import { favoritesUtils } from '@/features/favorites/utils/favoritesUtils'
import { Likes } from '@/features/post/api'
import { Post } from '@/features/post/types/postTypes'
import { Button } from '@/shared/ui'

import { PATH } from '@/shared/config/routes'
import s from './PostViewMode.module.scss'

type Props = {
  myLike: boolean
  changeLikeStatus: (action: Likes) => void
  post: Post
  variant?: 'modal' | 'feed'
  onCommentClick?: () => void
}

export const PostReactions = ({ myLike, changeLikeStatus, post, variant = 'modal', onCommentClick }: Props) => {
  const { data: me } = useGetMeQuery()
  const router = useRouter()

  const t = useTranslations('messages.favorites')
  const { toggleFavorite } = useFavorites()
  const isFavorite = favoritesUtils.isFavorite(post.id)

  const handleBookmarkClick = useCallback(() => {
    if (!me) {
      toast.info(t('loginRequired'))
      router.push(PATH.AUTH.LOGIN)
      return
    }

    const result = toggleFavorite(post)

    if (result === 'added') {
      toast.success(t('added'))
    } else {
      toast.success(t('removed'))
    }
  }, [toggleFavorite, post, t, me])

  const handleLikeClick = useCallback(() => {
    changeLikeStatus(myLike ? Likes.NONE : Likes.LIKE)
  }, [changeLikeStatus, myLike, me, t])

  return (
    <div className={s.postReactions}>
      <div className={clsx(s.icons, s[variant])}>
        <div className={s.leftIcons}>
          <Button
            variant="icon"
            onClick={handleLikeClick}
            className={s.iconButton}
            aria-label={myLike ? 'Unlike post' : 'Like post'}
          >
            {myLike ? <FaHeart className={s.redHeart} /> : <FaRegHeart className={s.icon} />}
          </Button>

          {variant === 'feed' && (
            <Button variant="icon" className={s.iconButton} onClick={onCommentClick} aria-label="Post comments">
              <IoChatbubbleEllipsesOutline />
            </Button>
          )}

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
