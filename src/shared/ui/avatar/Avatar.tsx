import { ComponentProps } from 'react'
import * as AvatarRadix from '@radix-ui/react-avatar'
import clsx from 'clsx'
import s from './Avatar.module.scss'
import { useGenerateColor } from '@/shared/ui/avatar/hooks/useGenerateColor'

type Props = {
  avatar?: string
  name?: string
  size?: 'small' | 'medium' | 'large'
} & ComponentProps<typeof AvatarRadix.Root>

export const Avatar = ({ avatar, className, name, size = 'medium', ...rest }: Props) => {
  const { lightBackground, textColor } = useGenerateColor()
  
  // Create a fallback using the first letters of the name
  const fallback = name
    ?.split(' ')
    .slice(0, 2)
    .map((e) => e[0])
    .join('')

  // const lightBackground = localStorage.getItem('lightBackground') || '#92cdff'
  // const textColor = localStorage.getItem('textColor') || '#124dbf'

  return (
    <AvatarRadix.Root className={clsx(s.avatarRoot, className)} data-size={size} {...rest}>
      <AvatarRadix.Image alt={name} className={s.avatarImage} src={avatar} />

      <AvatarRadix.Fallback
        className={s.avatarFallback}
        delayMs={0}
        style={{ background: lightBackground, color: textColor }}
      >
        {fallback}
      </AvatarRadix.Fallback>
    </AvatarRadix.Root>
  )
}
