'use client'
import { useGetMeQuery } from '@/features/auth/api/authApi'
import { Loader, UserCard } from '@/shared/ui'
import clsx from 'clsx'
import { useParams, useRouter } from 'next/navigation'
import { useGetChatListQuery } from '../api'
import { modifyMessage } from '../utils'
import s from './ChatList.module.scss'

export const ChatList = () => {
  const { data: chatList, isLoading, refetch } = useGetChatListQuery()
  const { data: currentUser } = useGetMeQuery()

  const router = useRouter()
  const params = useParams()
  const selectedId = params?.dialoguePartnerId

  const handleSelect = (dialoguePartnerId: number) => {
    const idStr = dialoguePartnerId.toString()
    router.push(`/messenger/${idStr}`)
  }

  return (
    <ul>
      {isLoading ? (
        <Loader reduced />
      ) : (
        chatList?.items.map((chat) => {
          const user = { id: chat.ownerId, userName: chat.userName, avatar: chat.avatars?.[0]?.url || '' }

          const displayText = modifyMessage({
            text: chat.messageText,
            ownerId: chat.ownerId,
            currentUserId: currentUser?.userId ?? -1,
          })

          const dialoguePartnerId = chat.ownerId === currentUser?.userId ? chat.receiverId : chat.ownerId

          return (
            <li
              key={chat.id}
              className={clsx(s.chatItem, selectedId === chat.receiverId.toString() && s.selected)}
              onClick={() => handleSelect(dialoguePartnerId)}
            >
              <UserCard layout="stacked" user={user} date={chat.createdAt}>
                {displayText}
              </UserCard>
            </li>
          )
        })
      )}
    </ul>
  )
}
