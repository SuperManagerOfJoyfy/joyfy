'use client'
import { User, UserCard } from '@/shared/ui/userCard'
import { MessageItemByUser, useGetChatMessagesQuery } from '../api'
import s from './ChatArea.module.scss'
import { InputBox } from './InputBox'
import { MessageBubble } from './MessageBubble'
import { Scroll } from '@/shared/ui'

type Props = {
  selectedUser: User
  dialoguePartnerId: string
}

export const ChatArea = ({ selectedUser, dialoguePartnerId }: Props) => {
  const { data: chatMessages, isLoading } = useGetChatMessagesQuery(dialoguePartnerId)

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
                    message={messageText}
                    isSender={isSender}
                    userName={selectedUser.userName}
                    avatar={selectedUser.avatar}
                    timestamp={createdAt}
                    status={status}
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
