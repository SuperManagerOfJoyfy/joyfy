'use client'
import clsx from 'clsx'
import { IoCheckmarkDone, IoCheckmark } from 'react-icons/io5'
import { BiEditAlt, BiTrash } from 'react-icons/bi'
import * as ContextMenu from '@radix-ui/react-context-menu'
import { Avatar, Typography } from '@/shared/ui'
import { formatChatTimestamp } from '@/shared/utils/dateFunctions'
import { MessageStatus } from '../api/messengerApi.types'
import s from './MessageBubble.module.scss'
import { useState } from 'react'
import { getSocket } from '@/shared/config/socket'
import { WS_EVENT_PATH } from '@/shared/constants'

type Props = {
  message: string
  id: number
  isSender: boolean
  avatar?: string
  userName?: string
  createdAt: string
  updatedAt?: string
  status: MessageStatus
  onDelete: (messageId: number) => void
}

export const MessageBubble = ({
  id,
  message,
  isSender,
  userName,
  avatar,
  createdAt,
  updatedAt = '',
  status,
  onDelete,
}: Props) => {
  const [messageText, setMessageText] = useState(message)
  const [edit, setEdit] = useState(false)

  const handleEditMessage = (id: number, messageText: string) => {
    const socket = getSocket()
    if (socket && messageText.trim()) {
      socket.emit(WS_EVENT_PATH.UPDATE_MESSAGE, {
        id,
        message: messageText,
      })
    }
  }

  const activateEdit = () => {
    setEdit(!edit)
    handleEditMessage(id, messageText)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEditMessage(id, messageText)
      setEdit(false) // save and exit edit mode
    }
    if (e.key == 'Escape') {
      setMessageText(message) // reset to original
      setEdit(false)
    }
  }

  const messageContent = (
    <div className={clsx(s.bubbleRow, isSender ? s.sender : s.receiver)}>
      {!isSender && <Avatar avatar={avatar} name={userName} size="small" />}
      <div className={clsx(s.bubble, isSender ? s.senderBubble : s.receiverBubble)}>
        {edit ? (
          <textarea
            className={s.editInput}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onBlur={activateEdit}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <Typography variant="body2">{messageText}</Typography>
        )}

        <div className={s.footer}>
          <span className={clsx(s.timestamp, isSender ? s.senderTimestamp : s.receiverTimestamp)}>
            {formatChatTimestamp(createdAt)}
          </span>

          {isSender && (
            <div className={s.statusIcon}>{status === MessageStatus.READ ? <IoCheckmarkDone /> : <IoCheckmark />}</div>
          )}
        </div>
      </div>
    </div>
  )

  // Only open context menu if it's own message
  if (isSender) {
    return (
      <ContextMenu.Root>
        <ContextMenu.Trigger>{messageContent}</ContextMenu.Trigger>

        <ContextMenu.Portal>
          <ContextMenu.Content className={s.contextMenuContent}>
            <ContextMenu.Item className={s.contextMenuItem} onSelect={activateEdit}>
              <BiEditAlt /> Edit
            </ContextMenu.Item>
            <ContextMenu.Item className={s.contextMenuItem} onSelect={() => onDelete(id)}>
              <BiTrash /> Delete
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>
    )
  }

  // Receiver's message
  return messageContent
}
