'use client'
import { MessageStatus } from '@/features/messenger/api'
import { isValidUrl } from '@/features/messenger/utils'
import { getSocket } from '@/shared/config/socket'
import { WS_EVENT_PATH } from '@/shared/constants'
import { Avatar, TextArea, Typography } from '@/shared/ui'
import { formatChatTimestamp } from '@/shared/utils/dateFunctions'
import * as ContextMenu from '@radix-ui/react-context-menu'
import clsx from 'clsx'
import Image from 'next/image'
import React, { Fragment, useState } from 'react'
import { BiEditAlt, BiTrash } from 'react-icons/bi'
import { IoCheckmark, IoCheckmarkDone } from 'react-icons/io5'
import s from './MessageBubble.module.scss'

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

// Footer Component
const MessageFooter = ({
  messageType,
  isSender,
  createdAt,
  status,
}: {
  messageType: string
  isSender: boolean
  createdAt: string
  status: MessageStatus
}) => (
  <div className={clsx(s.footer, s[`${messageType}Footer`])}>
    <span className={clsx(s.timestamp, isSender ? s.senderTimestamp : s.receiverTimestamp)}>
      {formatChatTimestamp(createdAt)}
    </span>
    {isSender && (
      <div className={s.statusIcon}>{status === MessageStatus.READ ? <IoCheckmarkDone /> : <IoCheckmark />}</div>
    )}
  </div>
)

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

  // Parse message content
  let text: string | undefined
  let imageUrl: string | undefined

  if (messageText.includes('|||')) {
    const [t, img] = messageText.split('|||')
    text = t
    if (isValidUrl(img)) imageUrl = img
  } else if (isValidUrl(messageText)) {
    imageUrl = messageText
  } else {
    text = messageText
  }

  const messageType = imageUrl && text ? 'imageWithText' : imageUrl ? 'imageOnly' : 'textOnly'

  // Edit handlers
  const handleEditMessage = (id: number, text: string) => {
    const socket = getSocket()
    if (socket && text.trim()) {
      socket.emit(WS_EVENT_PATH.UPDATE_MESSAGE, { id, message: text })
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
      setEdit(false)
    }
    if (e.key === 'Escape') {
      setMessageText(originalMessage)
      setEdit(false)
    }
  }

  // Render content based on message type
  const renderMessageContent = () => {
    if (edit) {
      return (
        <TextArea
          className={s.editInput}
          value={text}
          onChange={(e) => setMessageText(e.target.value)}
          onBlur={activateEdit}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      )
    }

    switch (messageType) {
      case 'imageOnly':
        return (
          <Fragment>
            <div className={s.imageContainer}>
              <Image src={imageUrl!} width={360} height={360} alt="image" className={s.picture} priority />
            </div>
            <MessageFooter messageType={messageType} isSender={isSender} createdAt={createdAt} status={status} />
          </Fragment>
        )

      case 'imageWithText':
        return (
          <Fragment>
            <div className={s.imageContainer}>
              <Image src={imageUrl!} width={360} height={360} alt="image" className={s.picture} priority />
            </div>
            <div className={s.textContainer}>
              <Typography className={s.messageText} variant="body2">
                {text}
              </Typography>
              <MessageFooter messageType={messageType} isSender={isSender} createdAt={createdAt} status={status} />
            </div>
          </Fragment>
        )

      case 'textOnly':
      default:
        return (
          <Fragment>
            <Typography className={s.messageText} variant="body2">
              {text}
            </Typography>
            <MessageFooter messageType={messageType} isSender={isSender} createdAt={createdAt} status={status} />
          </Fragment>
        )
    }
  }

  const messageContent = (
    <div className={clsx(s.bubbleRow, isSender ? s.sender : s.receiver)}>
      {!isSender && <Avatar avatar={avatar} name={userName} size="small" />}
      <div className={clsx(s.bubble, isSender ? s.senderBubble : s.receiverBubble, s[messageType])}>
        {renderMessageContent()}
      </div>
    </div>
  )

  // Context menu for sender's messages
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

  return messageContent
}
