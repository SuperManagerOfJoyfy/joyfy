'use client'
import { LazyLoader, Loader, Scroll } from '@/shared/ui'
import { User, UserCard } from '@/shared/ui/userCard'
import { MessageItem } from '../api'
import { useMessengerController } from '../hooks/useMessengerController'
import { InputBox } from './InputBox'
import { MessageBubble } from './MessageBubble'
import { useTranslations } from 'next-intl'
import s from './ChatArea.module.scss'

type Props = {
  selectedUser: User
  dialoguePartnerId: string
}

export const ChatArea = ({ selectedUser, dialoguePartnerId }: Props) => {
  const { chatMessages, handleDelete, loadOlderMessages, isLoading, hasMore, isLoadingMore, scrollRef } =
    useMessengerController(dialoguePartnerId)

  const t = useTranslations('messenger')

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
          <LazyLoader onLoadMore={loadOlderMessages} hasMore={hasMore} isFetching={isLoadingMore} />
          {chatMessages.length ? (
            chatMessages.map((message: MessageItem) => {
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
            <div className={s.noMessages}>{t('noMessages')}</div>
          )}
        </div>
      </Scroll>

      <footer className={s.chatFooter}>
        <InputBox dialoguePartnerId={dialoguePartnerId} />
      </footer>
    </div>
  )
}
