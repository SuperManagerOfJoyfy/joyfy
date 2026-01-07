'use client'
import { useGetMeQuery } from '@/features/auth/api/authApi'
import { LazyLoader, Loader, Scroll } from '@/shared/ui'
import { useParams } from 'next/navigation'
import { useGetChatListQuery, useLazyGetChatListQuery } from '../api'

import { PATH } from '@/shared/config/routes'
import { ChatItem } from './ChatItem'
import { useCallback } from 'react'
import s from './Sidebar.module.scss'
import { useRouter } from '@/i18n/navigation'

export const ChatList = () => {
  const { data: currentUser } = useGetMeQuery()
  const { data: chatData, isLoading } = useGetChatListQuery({ cursor: undefined })
  const [fetchMoreChats, { isFetching: isLoadingMore }] = useLazyGetChatListQuery()

  console.log(chatData)

  const router = useRouter()
  const params = useParams()
  const rawSelectedId = params?.dialoguePartnerId
  const selectedId = Array.isArray(rawSelectedId) ? rawSelectedId[0] : rawSelectedId

  const chatList = chatData?.items || []
  const hasMore = chatData ? chatList.length < chatData.totalCount : false

  const handleFetchMore = useCallback(async () => {
    if (isLoadingMore) return
    const lastId = chatList.at(-1)?.id

    if (lastId) {
      try {
        const res = await fetchMoreChats({ cursor: lastId }).unwrap()
        console.log('fetched more', res)
      } catch (err) {
        console.error('Error loading more notifications:', err)
      }
    }
  }, [chatList, fetchMoreChats])

  const handleSelect = (dialoguePartnerId: number) => {
    const idStr = dialoguePartnerId.toString()
    router.push(`${PATH.USER.MESSENGER}/${idStr}`)
  }

  return (
    <Scroll>
      {isLoading ? (
        <Loader reduced className={s.loader} />
      ) : (
        chatList.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            currentUser={currentUser}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        ))
      )}
      <LazyLoader onLoadMore={handleFetchMore} hasMore={hasMore} isFetching={isLoadingMore} />
    </Scroll>
  )
}
