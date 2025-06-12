import { FaRegBookmark, FaRegHeart } from 'react-icons/fa'
import { FiSend } from 'react-icons/fi'
import s from './PostViewMode.module.scss'

export const PostReactions = () => {
  return (
    <div className={s.postReactions}>
      <div className={s.icons}>
        <div className={s.leftIcons}>
          <FaRegHeart type="button" className={s.icon} />
          <FiSend type="button" className={s.icon} />
        </div>

        <FaRegBookmark type="button" className={s.icon} />
      </div>
    </div>
  )
}
