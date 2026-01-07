import clsx from 'clsx'
import { UserCard } from '@/shared/ui'
import { ChatItem as ChatItemType } from '../api'
import { MeResponse } from '@/features/auth/api/authApi.types'
import { modifyMessage } from '../utils'
import s from './ChatItem.module.scss'
import { useTranslations } from 'next-intl'

type Props = {
  chat: ChatItemType
  currentUser?: MeResponse
  selectedId?: string
  onSelect: (dialoguePartnerId: number) => void
}

export const ChatItem = ({ chat, currentUser, selectedId, onSelect }: Props) => {
  const user = { id: chat.ownerId, userName: chat.userName, avatar: chat.avatars?.[0]?.url || '' }
  const t = useTranslations('messenger')

  let message = chat.messageText

  if (chat.messageText.includes('https://staging-it-incubator.s3.eu-central-1')) {
    message = 'Image'
  }

  if (chat.messageText.includes('|||')) {
    message = chat.messageText.split('|||')[0]
  }

  const displayText = modifyMessage({
    text: message,
    ownerId: chat.ownerId,
    currentUserId: currentUser?.userId ?? -1,
    youLabel: t('you'),
  })

  const dialoguePartnerId = chat.ownerId === currentUser?.userId ? chat.receiverId : chat.ownerId

  return (
    <li
      key={chat.id}
      className={clsx(s.chatItem, selectedId === chat.receiverId.toString() && s.selected)}
      onClick={() => onSelect(dialoguePartnerId)}
    >
      <UserCard layout="withDate" user={user} date={chat.createdAt}>
        {displayText}
      </UserCard>
    </li>
  )
}
