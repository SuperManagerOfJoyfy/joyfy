import { joyfyApi } from '@/shared/api/joyfyApi'
import { BaseMessage, ChatMessagesResponse, MessageItemByUser } from './messengerApi.types'
import { getSocket } from '@/shared/config/socket'
import { WS_EVENT_PATH } from '@/shared/constants'
import { selectCurrentUserId } from '@/features/auth/model/authSlice'
import { store } from '@/app/store/store'

export const messengerApi = joyfyApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (bulder) => ({
    getChatList: bulder.query<BaseMessage, void>({
      query: () => ({
        url: '/messenger',
      }),
    }),

    getChatMessages: bulder.query<ChatMessagesResponse, string>({
      query: (dialoguePartnerId) => ({
        url: `/messenger/${dialoguePartnerId}`,
      }),

      // For real time updates
      async onCacheEntryAdded(dialoguePartnerId, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        await cacheDataLoaded
        const socket = getSocket()
        if (!socket) return

        const state = store.getState()
        const currentUserId = selectCurrentUserId(state)

        const handleReceiveMessage = (message: MessageItemByUser) => {
          updateCachedData((draft) => {
            const idx = draft.items.findIndex((m) => m.id === message.id)

            if (idx !== -1) {
              // Update the message status and other fields if needed
              draft.items[idx] = { ...draft.items[idx], ...message }
            } else {
              // Add new message if not present
              const isCurrentChat =
                (message.ownerId === currentUserId && message.receiverId === +dialoguePartnerId) ||
                (message.ownerId === +dialoguePartnerId && message.receiverId === currentUserId)

              if (isCurrentChat) {
                draft.items.push(message)
              }
            }
          })
        }

        // Handle MESSAGE_SEND (acknowledge receipt)
        const handleMessageSend = (message: MessageItemByUser) => {
          // Only acknowledge if current user is the recipient
          if (message.receiverId === currentUserId) {
            socket.emit('acknowledge', { message, receiverId: currentUserId })
          }
          // Also add message to cache
          updateCachedData((draft) => {
            const exists = draft.items.some((m) => m.id === message.id)
            if (!exists) {
              draft.items.push(message)
            }
          })
        }

        const handleDeleteMessage = (messageId: number) => {
          updateCachedData((draft) => {
            draft.items = draft.items.filter((m) => m.id !== messageId)
          })
        }

        socket.on(WS_EVENT_PATH.RECEIVE_MESSAGE, handleReceiveMessage)
        socket.on(WS_EVENT_PATH.MESSAGE_SEND, handleMessageSend)
        socket.on(WS_EVENT_PATH.MESSAGE_DELETED, handleDeleteMessage)

        await cacheEntryRemoved
        socket.off(WS_EVENT_PATH.RECEIVE_MESSAGE, handleReceiveMessage)
        socket.off(WS_EVENT_PATH.MESSAGE_SEND, handleMessageSend)
        socket.off(WS_EVENT_PATH.MESSAGE_DELETED, handleDeleteMessage)
      },
    }),

    deleteMessage: bulder.mutation<void, { messageId: number; dialoguePartnerId: string }>({
      query: ({ messageId }) => ({
        url: `/messenger/${messageId}`,
        method: 'DELETE',
      }),
      async onQueryStarted({ messageId, dialoguePartnerId }, { dispatch, queryFulfilled }) {
        // Update all chat message caches
        const patchResults = dispatch(
          messengerApi.util.updateQueryData('getChatMessages', dialoguePartnerId, (draft) => {
            if (draft?.items) {
              draft.items = draft.items.filter((m) => m.id !== messageId)
            }
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResults.undo()
        }
      },
    }),
  }),
})

export const { useGetChatListQuery, useGetChatMessagesQuery, useDeleteMessageMutation } = messengerApi
