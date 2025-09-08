'use client'
import { useGetMeQuery } from '@/features/auth/api/authApi'
import { Loader } from '@/shared/ui'
import { useParams, useRouter } from 'next/navigation'
import { useGetChatListQuery, useLazyGetChatListQuery } from '../api'

import { PATH } from '@/shared/config/routes'
import { ChatItem } from './ChatItem'

export const ChatList = () => {
  const { data: chatList, isLoading } = useGetChatListQuery({ cursor: undefined })
  const [fetchMore, { isFetching: isLoadingMore }] = useLazyGetChatListQuery()
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
    <ul>
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
    </ul>
  )
}
