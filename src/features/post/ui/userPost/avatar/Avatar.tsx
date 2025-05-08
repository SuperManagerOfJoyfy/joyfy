import Image from 'next/image'
import s from './Avatar.module.scss'

type Props = {
  avatar?: string | null
  size?: 'small' | 'medium' | 'large'
  variant: string
}

export const Avatar = ({ avatar, size = 'medium' }: Props) => {
  const src = avatar ? avatar : '/default-avatar.png'

  return <Image src={src} alt="user avatar" data-type={size} className={s.avatar} height={204} width={204} />
}
