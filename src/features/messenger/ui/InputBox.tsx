'use client'

import React, { ChangeEvent, useState } from 'react'
import { IoMicOutline } from 'react-icons/io5'
import { PiImageSquare } from 'react-icons/pi'
import { Button, TextArea } from '@/shared/ui'
import { getSocket } from '@/shared/config/socket'
import { WS_EVENT_PATH } from '@/shared/constants'
import s from './InputBox.module.scss'

type Props = {
  dialoguePartnerId: string
}

export const InputBox = ({ dialoguePartnerId }: Props) => {
  const [messageText, setMessageText] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null)
  const [isRecording, setIsRecording] = useState(false)

  const handleTextMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setMessageText(text)
  }

  // TODO: Implement Image Click & Select logic
  // TODO: Implement Voice Recording logic

  const handleSend = () => {
    const socket = getSocket()
    if (socket && messageText.trim()) {
      socket.emit(WS_EVENT_PATH.RECEIVE_MESSAGE, {
        receiverId: +dialoguePartnerId,
        message: messageText,
      })
      setMessageText('')
    }
    // TODO: Implement voice upload logic
    // TODO: Implement image upload logic
  }

  // TODO: Implement voice message sending

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  //Determine what button to show
  const hasContent = messageText.trim() || selectedImage || voiceBlob
  const showSendButton = hasContent
  const showIcons = !hasContent && !isRecording

  return (
    <div className={s.inputBox}>
      <TextArea
        placeholder="Type message..."
        value={messageText}
        onChange={handleTextMessageChange}
        onKeyDown={handleKeyDown}
        textAreaClassName={s.messageInput}
        wrapperClassName={s.inputWrapper}
      />
      {/* Hidden file input */}
      <input type="file" accept="image/*" style={{ display: 'none' }} />

      {/* Show icons when no content */}
      {showIcons && (
        <div className={s.iconsWrapper}>
          <button className={s.iconButton}>
            <IoMicOutline size={20} />
          </button>
          <button className={s.iconButton}>
            <PiImageSquare size={20} />
          </button>
        </div>
      )}

      {/* Show send voice button when voice is recorded */}
      {voiceBlob && !isRecording && (
        <Button variant="text" className={s.inputButton}>
          Send voice
        </Button>
      )}

      {/* Show send message button when text or image */}
      {showSendButton && !voiceBlob && (
        <Button variant="text" className={s.inputButton} onClick={handleSend}>
          Send message
        </Button>
      )}
    </div>
  )
}
