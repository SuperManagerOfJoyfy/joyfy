'use client'
import React, { Fragment, useState } from 'react'
import clsx from 'clsx'
import * as ContextMenu from '@radix-ui/react-context-menu'
import { IoCheckmark, IoCheckmarkDone } from 'react-icons/io5'
import { BiEditAlt, BiTrash } from 'react-icons/bi'
import { Avatar, TextArea, Typography } from '@/shared/ui'
import { formatChatTimestamp } from '@/shared/utils/dateFunctions'
import { MessageStatus, messengerApi } from '@/features/messenger/api'
import { getSocket } from '@/shared/config/socket'
import { WS_EVENT_PATH } from '@/shared/constants'
import s from './MessageBubble.module.scss'
import Image from 'next/image'
import { isValidUrl } from '@/features/messenger/utils'
import { store } from '@/app/store/store'

type Props = {
  originalMessage: string
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
  originalMessage,
  isSender,
  userName,
  avatar,
  createdAt,
  status,
  onDelete,
}: Props) => {
  const [messageText, setMessageText] = useState(originalMessage)
  const [edit, setEdit] = useState(false)

  let text: string | undefined
  let imageUrl: string | undefined

  if (messageText.includes('|||')) {
    const [t, img] = messageText.split('|||')
    text = t
    if (isValidUrl(img)) {
      imageUrl = img
    }
  } else if (isValidUrl(messageText)) {
    imageUrl = messageText
  } else {
    text = messageText
  }

  const handleEditMessage = (id: number, text: string) => {
    const socket = getSocket()
    if (socket && text.trim()) {
      socket.emit(WS_EVENT_PATH.UPDATE_MESSAGE, {
        id,
        message: text,
      })
    }
  }

  const activateEdit = () => {
    setEdit(!edit)
    handleEditMessage(id, text || messageText)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEditMessage(id, text || messageText)
      setEdit(false) // save and exit edit mode
    }
    if (e.key == 'Escape') {
      setMessageText(originalMessage) // reset to original
      setEdit(false)
    }
  }

  const messageContent = (
    <div className={clsx(s.bubbleRow, isSender ? s.sender : s.receiver)}>
      {!isSender && <Avatar avatar={avatar} name={userName} size="small" />}
      <div className={clsx(s.bubble, isSender ? s.senderBubble : s.receiverBubble)}>
        {edit ? (
          <TextArea
            className={s.editInput}
            value={text}
            onChange={(e) => setMessageText(e.target.value)}
            onBlur={activateEdit}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <Fragment>
            {imageUrl && <Image src={imageUrl} width={360} height={360} alt="image" priority />}
            {text && <Typography variant="body2">{text}</Typography>}
          </Fragment>
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
  // Only open context menu if its own message
  if (isSender) {
    return (
      <ContextMenu.Root>
        <ContextMenu.Trigger>{messageContent}</ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content className={s.contextMenuContent}>
            {!imageUrl && (
              <ContextMenu.Item className={s.contextMenuItem} onSelect={activateEdit}>
                <BiEditAlt /> Edit
              </ContextMenu.Item>
            )}
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
