import clsx from 'clsx'
import { IoCheckmarkDone, IoCheckmark } from 'react-icons/io5'
import { Avatar, Typography } from '@/shared/ui'
import { formatChatTimestamp } from '@/shared/utils/dateFunctions'
import { MessageStatus } from '../api/messengerApi.types'
import s from './MessageBubble.module.scss'

type Props = {
  message: string
  isSender: boolean
  avatar?: string
  userName?: string
  timestamp: string
  status: MessageStatus
}

export const MessageBubble = ({ message, isSender, userName, avatar, timestamp, status }: Props) => {
  return (
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
}
