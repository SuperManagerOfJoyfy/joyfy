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

type Props = {
  message: string
  id: number
  isSender: boolean
  avatar?: string
  userName?: string
  timestamp: string
  status: MessageStatus
  onDelete: (messageId: number) => void
}

export const MessageBubble = ({ id, message, isSender, userName, avatar, timestamp, status, onDelete }: Props) => {
  const [contextMenuSelection, setContextMenuSelection] = useState('')

  const messageContent = (
    <div className={clsx(s.bubbleRow, isSender ? s.sender : s.receiver)}>
      {!isSender && <Avatar avatar={avatar} name={userName} size="small" />}
      <div className={clsx(s.bubble, isSender ? s.senderBubble : s.receiverBubble)}>
        <Typography variant="body2">{message}</Typography>

        <div className={s.footer}>
          <span className={clsx(s.timestamp, isSender ? s.senderTimestamp : s.receiverTimestamp)}>
            {formatChatTimestamp(timestamp)}
          </span>

          {isSender && <div className={s.statusIcon}>{status === 'READ' ? <IoCheckmarkDone /> : <IoCheckmark />}</div>}
        </div>
      </div>
    </div>
  )

  // Only open context menu if it's a sender's message
  if (isSender) {
    return (
      <ContextMenu.Root>
        <ContextMenu.Trigger>{messageContent}</ContextMenu.Trigger>

        <ContextMenu.Portal>
          <ContextMenu.Content className={s.contextMenuContent}>
            <ContextMenu.Item className={s.contextMenuItem} onSelect={() => {}}>
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
