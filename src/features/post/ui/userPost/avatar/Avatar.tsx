import Image from 'next/image'
import s from './Avatar.module.scss'

type Props = {
  avatar?: string | null
  variant?: 'userProfile' | 'userCard'
}

export const Avatar = ({ avatar, variant = 'userProfile' }: Props) => {
  const src = avatar?.trim() ? avatar : '/default-avatar.png'

  return <Image src={src} alt="user avatar" data-variant={variant} className={s.avatar} height={204} width={204} />
}
