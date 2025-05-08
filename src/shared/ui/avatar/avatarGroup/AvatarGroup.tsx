import { Avatar } from '@/shared/ui'

import s from './AvatarGroup.module.scss'

type Props = {
  avatars: Array<string | null>
  maxDisplay?: number
}

export const AvatarGroup = ({ avatars, maxDisplay = 3 }: Props) => {
  const displayAvatars = avatars.slice(0, maxDisplay)

  return (
    <div className={s.avatarGroup}>
      {displayAvatars.map((avatar, index) => (
        <div
          key={index}
          className={s.avatarWrapper}
          style={{
            zIndex: displayAvatars.length - index,
          }}
        >
          <Avatar avatar={avatar} size={'small'} />
        </div>
      ))}
    </div>
  )
}
