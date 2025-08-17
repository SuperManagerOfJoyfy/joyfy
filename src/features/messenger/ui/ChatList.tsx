'use client'
import { Loader, UserCard } from '@/shared/ui'
import { useGetChatListQuery } from '../api'

export const ChatList = () => {
  const { data: chatList, isLoading } = useGetChatListQuery()

  return (
    <ul>
      {isLoading ? (
        <Loader reduced />
      ) : (
        chatList?.items.map((chat) => {
          const user = { id: chat.ownerId, userName: chat.userName, avatars: chat.avatars }
          return (
            <li key={chat.id}>
              <UserCard layout="stacked" user={user}>
                {chat.messageText}
              </UserCard>
            </li>
          )
        })
      )}
    </ul>
  )
}
