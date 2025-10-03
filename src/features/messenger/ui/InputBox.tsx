'use client'

import React, { ChangeEvent, useRef, useState } from 'react'
import { IoMicOutline } from 'react-icons/io5'
import { PiImageSquare } from 'react-icons/pi'
import { Button, TextArea } from '@/shared/ui'
import { getSocket } from '@/shared/config/socket'
import { WS_EVENT_PATH } from '@/shared/constants'
import s from './InputBox.module.scss'
import { useUploadImageMutation } from '@/features/post/api'
import { isValidUrl } from '@/features/messenger/utils'
import Image from 'next/image'

type Props = {
  dialoguePartnerId: string
}

export const InputBox = ({ dialoguePartnerId }: Props) => {
  const [messageText, setMessageText] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [uploadImage] = useUploadImageMutation()
  const handleTextMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setMessageText(text)
  }

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('Размер изображения не должен превышать 1 МБ')
        return
      }
      setSelectedImage(file)
    }
    e.target.value = ''
  }

  const handleSend = async () => {
    const socket = getSocket()
    if (!socket) return

    setIsSending(true)
    //если в поле сообщения только текст
    if (messageText.trim() && !selectedImage) {
      socket.emit(WS_EVENT_PATH.RECEIVE_MESSAGE, {
        receiverId: +dialoguePartnerId,
        message: messageText,
      })
      setMessageText('')
    }

    //если в поле сообщения только картинка (с текстом или без)
    if (selectedImage) {
      const formData = new FormData()
      formData.append('file', selectedImage)

      try {
        const response = await uploadImage(formData).unwrap()
        const url = response.images[0].url
        //проверка валидна ли ссылка с ответа
        if (!isValidUrl(url)) {
          console.log('Invalid image URL:', url)
          return
        }
        let finalMessage = url
        // кейс если вдруговозле картинки есть текст
        if (messageText.trim()) {
          finalMessage = `${messageText.trim()}|||${url}`
        }
        socket.emit(WS_EVENT_PATH.RECEIVE_MESSAGE, {
          receiverId: +dialoguePartnerId,
          message: finalMessage,
        })
        setMessageText('')
        setSelectedImage(null)
      } catch (error) {
        console.log('Upload error:', error)
      }
    }
    setIsSending(false)
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

  return (
    <div className={s.inputBoxWrapper}>
      <div className={s.inputBox}>
        {selectedImage && (
          <div className={s.imagePreview}>
            <Image src={URL.createObjectURL(selectedImage)} width={36} height={36} alt="Preview" />
            <button
              className={s.removeButton}
              onClick={() => setSelectedImage(null)}
              aria-label="Remove image"
              disabled={isSending}
            >
              ×
            </button>
          </div>
        )}
        <TextArea
          placeholder="Type message..."
          value={messageText}
          onChange={handleTextMessageChange}
          onKeyDown={handleKeyDown}
          textAreaClassName={s.messageInput}
          wrapperClassName={s.inputWrapper}
          disabled={isSending}
        />
      </div>

      <div className={s.Buttons}>
        {!hasContent && (
          <div className={s.iconsWrapper}>
            <button className={s.iconButton}>
              <IoMicOutline size={20} />
            </button>
            <button className={s.iconButton} onClick={() => fileInputRef.current?.click()}>
              <PiImageSquare size={20} />
            </button>
          </div>
        )}

        {/* Show send message button when text or image */}
        {hasContent && !voiceBlob && (
          <Button variant="text" className={s.inputButton} onClick={handleSend} disabled={isSending}>
            Send message
          </Button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        id="fileInput"
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageSelect}
      />

      {/* Show send voice button when voice is recorded */}
      {/*{voiceBlob && !isRecording && (*/}
      {/*  <Button variant="text" className={s.inputButton}>*/}
      {/*    Send voice*/}
      {/*  </Button>*/}
      {/*)}*/}
    </div>
  )
}
