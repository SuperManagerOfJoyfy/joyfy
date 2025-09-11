'use client'
import { useGetMeQuery } from '@/features/auth/api/authApi'
import { Loader, Scroll } from '@/shared/ui'
import { useParams, useRouter } from 'next/navigation'
import { useGetChatListQuery } from '../api'

import { PATH } from '@/shared/config/routes'
import { ChatItem } from './ChatItem'

export const ChatList = () => {
  const { data: chatList, isLoading } = useGetChatListQuery()

  const { data: currentUser } = useGetMeQuery()

  const router = useRouter()
  const params = useParams()
  const rawSelectedId = params?.dialoguePartnerId
  const selectedId = Array.isArray(rawSelectedId) ? rawSelectedId[0] : rawSelectedId

  const handleSelect = (dialoguePartnerId: number) => {
    const idStr = dialoguePartnerId.toString()
    router.push(`${PATH.USER.MESSENGER}/${idStr}`)
  }

  return (
    <Scroll>
      {isLoading ? (
        <Loader reduced />
      ) : (
        chatList?.items.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            currentUser={currentUser}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        ))
      )}
    </Scroll>
  )
}
