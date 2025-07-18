import { FaRegHeart, FaHeart } from 'react-icons/fa'
import clsx from 'clsx'

import { Button } from '@/shared/ui'

import s from './LikeButton.module.scss'

type LikeButtonProps = {
  isLiked: boolean
  onClick: () => void
  disabled?: boolean
  className?: string
  iconClassName?: string
}

export const LikeButton = ({ isLiked, onClick, disabled = false, className, iconClassName }: LikeButtonProps) => {
  return (
    <Button
      variant="icon"
      onClick={onClick}
      disabled={disabled}
      className={className}
      aria-label={isLiked ? 'Unlike' : 'Like'}
    >
      {isLiked ? <FaHeart className={clsx(iconClassName, s.liked)} /> : <FaRegHeart className={iconClassName} />}
    </Button>
  )
}
