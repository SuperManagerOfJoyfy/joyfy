import { FaRegBookmark, FaRegHeart, FaHeart } from 'react-icons/fa'
import { FiSend } from 'react-icons/fi'
import s from './PostViewMode.module.scss'
import { Likes } from '@/features/post/api'

type Props = {
  myLike: boolean
  changeLikeStatus: (action: Likes) => void
}

export const PostReactions = ({ myLike, changeLikeStatus }: Props) => {
  return (
    <div className={s.postReactions}>
      <div className={s.icons}>
        <div className={s.leftIcons}>
          {myLike ? (
            <FaHeart type="button" onClick={() => changeLikeStatus(Likes.NONE)} className={s.redHeart} />
          ) : (
            <FaRegHeart type="button" onClick={() => changeLikeStatus(Likes.LIKE)} className={s.icon} />
          )}

          <FiSend type="button" className={s.icon} />
        </div>

        <FaRegBookmark type="button" className={s.icon} />
      </div>
    </div>
  )
}
