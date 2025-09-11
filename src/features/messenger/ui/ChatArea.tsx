'use client'
import { useEffect, useRef } from 'react'
import { User, UserCard } from '@/shared/ui/userCard'
import { LazyLoader, Loader, Scroll } from '@/shared/ui'
import { InputBox } from './InputBox'
import { MessageBubble } from './MessageBubble'
import {
  MessageItem,
  MessageStatus,
  useDeleteMessageMutation,
  useGetChatMessagesQuery,
  useLazyGetOlderMessagesQuery,
  useUpdateMessageStatusMutation,
} from '../api'
import { getSocket } from '@/shared/config/socket'
import { WS_EVENT_PATH } from '@/shared/constants'
import s from './ChatArea.module.scss'

type Props = {
  selectedUser: User
  dialoguePartnerId: string
}

export const ChatArea = ({ selectedUser, dialoguePartnerId }: Props) => {
  const { data: chatMessages, isLoading } = useGetChatMessagesQuery(dialoguePartnerId)
  const [trigger, { isFetching: isLoadingMore }] = useLazyGetOlderMessagesQuery()
  const [deleteMessage] = useDeleteMessageMutation()
  const [updateMessageStatus] = useUpdateMessageStatusMutation()

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scroll = scrollRef.current
    if (!scroll || !chatMessages?.items?.length) return
    if (scroll) {
      scroll.scrollTop = scroll.scrollHeight
    }
  }, [chatMessages?.items?.length])

  useEffect(() => {
    if (chatMessages?.items) {
      const unreadMessagesIds = chatMessages.items
        .filter((m) => m.status !== MessageStatus.READ && m.ownerId === +dialoguePartnerId) // mark messages from other user as read
        .map((m) => m.id)

      if (unreadMessagesIds.length > 0) {
        updateMessageStatus({ ids: unreadMessagesIds, dialoguePartnerId })
      }
    }
  }, [chatMessages, dialoguePartnerId, updateMessageStatus])

  const hasMore = chatMessages ? chatMessages.items.length < chatMessages.totalCount : false

  const loadOlder = async () => {
    if (isLoadingMore) return
    if (!chatMessages || chatMessages.items.length === 0) return

    const scroll = scrollRef.current
    const prevScrollHeight = scroll?.scrollHeight ?? 0
    const prevScrollTop = scroll?.scrollTop ?? 0

    const oldestMessagesId = chatMessages.items[0].id
    await trigger({ dialoguePartnerId, cursor: oldestMessagesId })

    requestAnimationFrame(() => {
      if (!scroll) return
      const newScrollHeight = scroll.scrollHeight
      scroll.scrollTop = newScrollHeight - prevScrollHeight + prevScrollTop
    })
  }

  const handleDelete = async (messageId: number) => {
    try {
      await deleteMessage({ messageId, dialoguePartnerId }).unwrap()
      const socket = getSocket()
      if (socket) {
        socket.emit(WS_EVENT_PATH.MESSAGE_DELETED, { messageId })
      }
    } catch (error) {
      console.error('Failed to delete message:', error)
    }
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className={s.chatArea}>
      <header className={s.chatHeader}>
        <UserCard user={selectedUser} />
      </header>

      <Scroll className={s.scrollArea} ref={scrollRef}>
        <div className={s.chatBody}>
          <LazyLoader onLoadMore={loadOlder} hasMore={hasMore} isFetching={isLoadingMore} />
          {chatMessages?.items.length ? (
            [...chatMessages.items].map((message: MessageItem) => {
              const { id, messageText, createdAt, status, updatedAt } = message
              const isSender = message.ownerId !== +dialoguePartnerId

              return (
                <MessageBubble
                  key={id}
                  id={id}
                  originalMessage={messageText}
                  isSender={isSender}
                  userName={selectedUser.userName}
                  avatar={selectedUser.avatar}
                  createdAt={createdAt}
                  updatedAt={updatedAt}
                  status={status}
                  onDelete={handleDelete}
                />
              )
            })
          ) : (
            <div className={s.noMessages}>No messages yet</div>
          )}
        </div>
      </Scroll>

      <footer className={s.chatFooter}>
        <InputBox dialoguePartnerId={dialoguePartnerId} />
      </footer>
    </div>
  )
}
