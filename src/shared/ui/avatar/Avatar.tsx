import { ComponentProps } from 'react'
import * as AvatarRadix from '@radix-ui/react-avatar'
import clsx from 'clsx'
import s from './Avatar.module.scss'
import { useGenerateColor } from '@/shared/ui/avatar/hooks/useGenerateColor'

type Props = {
  avatar?: string
  name?: string
  size?: 'small' | 'medium' | 'large' | 'regular'
} & ComponentProps<typeof AvatarRadix.Root>

export const Avatar = ({ avatar, className, name = 'User', size = 'medium', ...rest }: Props) => {
  const { lightBackground, textColor } = useGenerateColor(name)

  const fallback = name
    ?.split(' ')
    .slice(0, 2)
    .map((e) => e[0])
    .join('')

  return (
    <AvatarRadix.Root className={clsx(s.avatarRoot, className)} data-size={size} {...rest}>
      <AvatarRadix.Image alt={name} className={s.avatarImage} src={avatar || undefined} />

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
