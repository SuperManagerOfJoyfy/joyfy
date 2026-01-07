import { getSocket } from '@/shared/config/socket'
import { WS_EVENT_PATH } from '@/shared/constants'
import { useEffect, useRef } from 'react'
import {
  MessageStatus,
  messengerApi,
  useDeleteMessageMutation,
  useGetChatMessagesQuery,
  useLazyGetOlderMessagesQuery,
  useUpdateMessageStatusMutation,
} from '../api'
import { useAppDispatch } from '@/app/store/store'

export const useMessengerController = (dialoguePartnerId: string) => {
  const { data: messagesData, isLoading } = useGetChatMessagesQuery(dialoguePartnerId)
  const [trigger, { isFetching: isLoadingMore }] = useLazyGetOlderMessagesQuery()
  const [deleteMessage] = useDeleteMessageMutation()
  const [updateMessageStatus] = useUpdateMessageStatusMutation()
  const dispatch = useAppDispatch()

  const chatMessages = messagesData?.items || []

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scroll = scrollRef?.current
    if (!scroll || !chatMessages.length) return
    if (scroll) {
      scroll.scrollTop = scroll.scrollHeight
    }
  }, [chatMessages.length])

  useEffect(() => {
    if (chatMessages) {
      const unreadMessagesIds = chatMessages
        .filter((m) => m.status !== MessageStatus.READ && m.ownerId === +dialoguePartnerId) // mark messages from other user as read
        .map((m) => m.id)

      if (unreadMessagesIds.length > 0) {
        updateMessageStatus({ ids: unreadMessagesIds, dialoguePartnerId })
      }

      // Update the chat list's unread count
      dispatch(
        messengerApi.util.updateQueryData('getChatList', { cursor: undefined }, (draft) => {
          // Reduce the global unread count by the number of messages being marked as read
          draft.notReadCount = Math.max(0, (draft.notReadCount || 0) - unreadMessagesIds.length)
        })
      )
    }
  }, [chatMessages, dialoguePartnerId, updateMessageStatus])

  const hasMore = messagesData ? chatMessages.length < messagesData.totalCount : false

  const loadOlderMessages = async () => {
    if (isLoadingMore) return
    if (!chatMessages || chatMessages.length === 0) return

    const scroll = scrollRef?.current
    const prevScrollHeight = scroll?.scrollHeight ?? 0
    const prevScrollTop = scroll?.scrollTop ?? 0

    const oldestMessagesId = chatMessages[0].id
    await trigger({ dialoguePartnerId, cursor: oldestMessagesId })

    requestAnimationFrame(() => {
      if (!scroll) return
      const newScrollHeight = scroll.scrollHeight
      scroll.scrollTop = newScrollHeight - prevScrollHeight + prevScrollTop
    })
  }

  const handleDelete = async (messageId: number) => {
    try {
      await deleteMessage({ messageId, dialoguePartnerId }).unwrap()
      const socket = getSocket()
      if (socket) {
        socket.emit(WS_EVENT_PATH.MESSAGE_DELETED, { messageId })
      }
    } catch (error) {
      console.error('Failed to delete message:', error)
    }
  }
  return { chatMessages, handleDelete, loadOlderMessages, isLoading, hasMore, isLoadingMore, scrollRef }
}
