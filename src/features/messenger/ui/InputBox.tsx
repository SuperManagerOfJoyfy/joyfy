'use client'

import React, { ChangeEvent, useRef, useState } from 'react'
import { PiImageSquare } from 'react-icons/pi'
import { Button, TextArea } from '@/shared/ui'
import { getSocket } from '@/shared/config/socket'
import { WS_EVENT_PATH } from '@/shared/constants'
import s from './InputBox.module.scss'
import { useUploadImageMutation } from '@/features/post/api'
import { isValidUrl } from '@/features/messenger/utils'
import Image from 'next/image'
import { toast } from 'react-toastify'
import { useTranslations } from 'next-intl'

type Props = {
  dialoguePartnerId: string
}

export const InputBox = ({ dialoguePartnerId }: Props) => {
  const [messageText, setMessageText] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [isSending, setIsSending] = useState(false)

  const t = useTranslations('messenger.input')
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
        toast.error(t('imageTooLarge'))
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

    if (messageText.trim() && !selectedImage) {
      socket.emit(WS_EVENT_PATH.RECEIVE_MESSAGE, {
        receiverId: +dialoguePartnerId,
        message: messageText,
      })
      setMessageText('')
    }

    if (selectedImage) {
      const formData = new FormData()
      formData.append('file', selectedImage)

      try {
        const response = await uploadImage(formData).unwrap()
        const url = response.images[0].url

        if (!isValidUrl(url)) {
          console.log('Invalid image URL:', url)
          return
        }
        let finalMessage = url

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  //Determine what button to show
  const hasContent = messageText.trim() || selectedImage

  return (
    <div className={s.inputBoxWrapper}>
      <div className={s.inputBox}>
        {selectedImage && (
          <div className={s.imagePreview}>
            <Image src={URL.createObjectURL(selectedImage)} width={36} height={36} alt={t('previewAlt')} />
            <button
              className={s.removeButton}
              onClick={() => setSelectedImage(null)}
              aria-label={t('removeImage')}
              disabled={isSending}
            >
              ×
            </button>
          </div>
        )}
        <TextArea
          placeholder={t('placeholder')}
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
            <button className={s.iconButton} onClick={() => fileInputRef.current?.click()} aria-label="Attach image">
              <PiImageSquare size={20} />
            </button>
          </div>
        )}

        {hasContent && (
          <Button
            variant="text"
            className={s.inputButton}
            onClick={handleSend}
            disabled={isSending}
            aria-label={isSending ? 'Sending message...' : 'Send message'}
          >
            {t('send')}
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
        aria-label="Select image file"
      />
    </div>
  )
}
