import clsx from 'clsx'
import { RiCheckDoubleLine } from 'react-icons/ri'
import { Avatar } from '@/shared/ui'
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
        <span className={s.message}>{message}</span>
        <div className={s.footer}>
          <span className={isSender ? s.senderTimestamp : s.receiverTimestamp}>{formatChatTimestamp(timestamp)}</span>
          {status === 'READ' && <RiCheckDoubleLine className={s.readIcon} />}
        </div>
      </div>
    </div>
  )
}
