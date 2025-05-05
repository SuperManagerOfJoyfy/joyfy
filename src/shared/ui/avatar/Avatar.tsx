import Image from 'next/image'
import s from './Avatar.module.scss'

export type Props = {
  avatar?: string | null
  size?: 'small' | 'medium' | 'large'
}

export const Avatar = ({ avatar, size = 'medium' }: Props) => {
  const src = avatar ? avatar : '/default-avatar.png'

  return <Image src={src} alt="user avatar" data-size={size} className={s.avatar} height={36} width={36} />
}
