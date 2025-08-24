'use client'
import { User, UserCard } from '@/shared/ui/userCard'
import { MessageItemByUser, useDeleteMessageMutation, useGetChatMessagesQuery } from '../api'
import s from './ChatArea.module.scss'
import { InputBox } from './InputBox'
import { MessageBubble } from './MessageBubble'
import { Scroll } from '@/shared/ui'
import { getSocket } from '@/shared/config/socket'
import { WS_EVENT_PATH } from '@/shared/constants'

type Props = {
  selectedUser: User
  dialoguePartnerId: string
}

export const ChatArea = ({ selectedUser, dialoguePartnerId }: Props) => {
  const { data: chatMessages, isLoading } = useGetChatMessagesQuery(dialoguePartnerId)
  const [deleteMessage] = useDeleteMessageMutation()

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
    return <div className={s.loading}>Loading messages...</div>
  }

  return (
    <div className={s.chatArea}>
      <header className={s.chatHeader}>
        <UserCard user={selectedUser} />
      </header>

      <div className={s.chatBody}>
        <Scroll>
          {chatMessages?.items.length ? (
            [...chatMessages.items]
              .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
              .map((message: MessageItemByUser) => {
                const { id, messageText, createdAt, status } = message
                const isSender = message.ownerId !== +dialoguePartnerId

                return (
                  <MessageBubble
                    key={id}
                    id={id}
                    message={messageText}
                    isSender={isSender}
                    userName={selectedUser.userName}
                    avatar={selectedUser.avatar}
                    timestamp={createdAt}
                    status={status}
                    // onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                )
              })
          ) : (
            <div className={s.noMessages}>No messages yet</div>
          )}
        </Scroll>
      </div>

      <footer className={s.chatFooter}>
        <InputBox dialoguePartnerId={dialoguePartnerId} />
      </footer>
    </div>
  )
}
