import { joyfyApi } from '@/shared/api/joyfyApi'
import {
  ChatItem,
  ChatResponse,
  MessageItem,
  MessageRequest,
  MessageResponse,
  MessageStatus,
} from './messengerApi.types'
import { getSocket } from '@/shared/config/socket'
import { WS_EVENT_PATH } from '@/shared/constants'
import { selectCurrentUserId } from '@/features/auth/model/authSlice'
import { store } from '@/app/store/store'

const waitForSocket = async (timeoutMs = 5000) => {
  const start = Date.now()
  return new Promise<ReturnType<typeof getSocket> | null>((resolve) => {
    const tick = () => {
      const s = getSocket()
      if (s) return resolve(s)
      if (Date.now() - start >= timeoutMs) return resolve(null)
      setTimeout(tick, 100)
    }
    tick()
  })
}

export const messengerApi = joyfyApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getChatList: builder.query<ChatResponse, { cursor?: number; pageSize?: number }>({
      query: ({ cursor, pageSize = 12 } = {}) => ({
        url: '/messenger',
        params: cursor ? { cursor, pageSize } : { pageSize },
      }),
      providesTags: ['ChatList'],

      serializeQueryArgs: ({ endpointName }) => endpointName,

      merge: (currentCache, newData) => {
        // Map key: conversationKey
        const chatMap = new Map<string, ChatItem>()

        // Helper to get a unique key for a conversation
        const getConversationKey = (chat: ChatItem) =>
          [Math.min(chat.ownerId, chat.receiverId), Math.max(chat.ownerId, chat.receiverId)].join('-')

        // Add existing chats
        currentCache.items.forEach((chat) => {
          const key = getConversationKey(chat)

          if (!chatMap.has(key) || new Date(chat.updatedAt) > new Date(chatMap.get(key)!.updatedAt)) {
            chatMap.set(key, chat)
          }
        })

        // Add/replace with new chats if newer
        newData.items.forEach((newChat) => {
          const key = getConversationKey(newChat)
          if (!chatMap.has(key) || new Date(newChat.updatedAt) > new Date(chatMap.get(key)!.updatedAt)) {
            chatMap.set(key, newChat)
          }
        })

        // Convert back to array and sort by updatedAt descending
        currentCache.items = Array.from(chatMap.values()).sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        currentCache.totalCount = newData.totalCount
        currentCache.notReadCount = newData.notReadCount
        currentCache.pageSize = newData.pageSize
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.cursor !== previousArg?.cursor
      },
    }),

    getChatMessages: builder.query<MessageResponse, string>({
      query: (dialoguePartnerId) => ({
        url: `/messenger/${dialoguePartnerId}`,
        invalidatesTags: ['ChatList'],
      }),
      // display latest messages last
      transformResponse: (response: MessageResponse) => ({
        ...response,
        items: response.items.reverse(),
      }),

      // For real time updates
      async onCacheEntryAdded(dialoguePartnerId, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        await cacheDataLoaded

        let socket = await waitForSocket()

        if (!socket) return

        const meId = selectCurrentUserId(store.getState())

        const handleReceiveMessage = (data: MessageItem | MessageItem[], callback?: Function) => {
          // Normalize to array
          const messages = Array.isArray(data) ? data : [data]

          messages.forEach((message) => {
            console.log('📬 Received message update:', {
              id: message.id,
              status: message.status,
              isSender: message.ownerId === meId,
              hasCallback: !!callback,
            })

            if (!message || !message.id) return

            const isCurrentChat =
              (message.ownerId === meId && message.receiverId === +dialoguePartnerId) ||
              (message.ownerId === +dialoguePartnerId && message.receiverId === meId)

            if (!isCurrentChat) return

            updateCachedData((draft) => {
              const idx = draft.items.findIndex((m) => m.id === message.id)

              if (idx !== -1) {
                draft.items[idx] = { ...draft.items[idx], ...message }
              } else {
                // Add new message if not present
                draft.items.push(message)
                draft.totalCount += 1
              }
            })

            // Acknowledge receipt if this is MESSAGE_SEND (recipient receiving new message)
            if (callback && message.ownerId !== meId && message.status === MessageStatus.SENT) {
              callback({ message, receiverId: meId })
            }
          })

          store.dispatch(messengerApi.util.invalidateTags(['ChatList']))
        }

        const handleDeleteMessage = (messageId: number) => {
          updateCachedData((draft) => {
            draft.items = draft.items.filter((m) => m.id !== messageId)
          })
        }

        const handleUpdateMessage = (updatedMessage: MessageItem) => {
          updateCachedData((draft) => {
            const idx = draft.items.findIndex((m) => m.id === updatedMessage.id)

            if (idx !== -1) {
              draft.items[idx] = { ...draft.items[idx], ...updatedMessage }
            }
          })
        }

        const bind = (s: any) => {
          s.on(WS_EVENT_PATH.RECEIVE_MESSAGE, handleReceiveMessage)
          s.on(WS_EVENT_PATH.MESSAGE_SEND, handleReceiveMessage)
          s.on(WS_EVENT_PATH.MESSAGE_DELETED, handleDeleteMessage)
          s.on(WS_EVENT_PATH.UPDATE_MESSAGE, handleUpdateMessage)
        }

        const unbind = (s: any) => {
          s.off(WS_EVENT_PATH.RECEIVE_MESSAGE, handleReceiveMessage)
          s.off(WS_EVENT_PATH.MESSAGE_SEND, handleReceiveMessage)
          s.off(WS_EVENT_PATH.MESSAGE_DELETED, handleDeleteMessage)
          s.off(WS_EVENT_PATH.UPDATE_MESSAGE, handleUpdateMessage)
        }

        bind(socket)
        // Rebind if socket instance changes (after reconnect)
        const rebinder = setInterval(() => {
          const s = getSocket()
          if (s && s !== socket) {
            unbind(socket)
            socket = s
            bind(socket)
          }
        }, 1000)

        await cacheEntryRemoved
        clearInterval(rebinder)
        unbind(socket)
      },
    }),

    getOlderMessages: builder.query<MessageResponse, MessageRequest>({
      query: ({ dialoguePartnerId, cursor, pageSize = 12 }) => ({
        url: `/messenger/${dialoguePartnerId}`,
        params: cursor ? { cursor, pageSize } : { pageSize },
      }),

      async onQueryStarted({ dialoguePartnerId }, { dispatch, queryFulfilled }) {
        try {
          const { data: newMessages } = await queryFulfilled
          dispatch(
            messengerApi.util.updateQueryData('getChatMessages', dialoguePartnerId, (draft) => {
              // Prepend older messages at the top
              const uniqueNewItems = newMessages.items.filter(
                (msg) => !draft.items.some((existing) => existing.id === msg.id)
              )
              draft.items = [...uniqueNewItems.reverse(), ...draft.items]
              draft.totalCount = newMessages.totalCount
              draft.notReadCount = newMessages.notReadCount
            })
          )
        } catch (e) {
          console.error('Error fetching older messages', e)
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.cursor !== previousArg?.cursor
      },
    }),

    deleteMessage: builder.mutation<void, { messageId: number; dialoguePartnerId: string }>({
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
              draft.totalCount -= 1
            }
          })
        )

        try {
          await queryFulfilled

          const state = store.getState()
          const remainingItems =
            messengerApi.endpoints.getChatMessages.select(dialoguePartnerId)(state)?.data?.items || []

          if (remainingItems.length === 0) {
            dispatch(
              messengerApi.util.updateQueryData('getChatList', { cursor: undefined }, (chatDraft) => {
                chatDraft.items = chatDraft.items.filter(
                  (m) => m.ownerId !== +dialoguePartnerId && m.receiverId !== +dialoguePartnerId
                )
                chatDraft.totalCount -= 1
              })
            )
          } else {
            // Find the new last message
            const lastMessage = remainingItems[remainingItems.length - 1]
            // Find the chat in the chat list
            dispatch(
              messengerApi.util.updateQueryData('getChatList', { cursor: undefined }, (chatDraft) => {
                const chat = chatDraft.items.find(
                  (m) => m.ownerId === +dialoguePartnerId || m.receiverId === +dialoguePartnerId
                )
                if (chat) {
                  // If the deleted message was the latest, update chat list preview
                  if (chat.messageText === lastMessage.messageText) {
                    // Do nothing, already up to date
                    return
                  } else if (chat.messageText && chat.messageText !== lastMessage.messageText) {
                    chat.messageText = lastMessage.messageText
                    chat.createdAt = lastMessage.createdAt
                    chat.updatedAt = lastMessage.updatedAt
                    chat.status = lastMessage.status
                  }
                }
              })
            )
          }
        } catch {
          patchResults.undo()
        }
      },
    }),

    updateMessageStatus: builder.mutation<void, { ids: number[]; dialoguePartnerId: string }>({
      query: ({ ids }) => ({
        url: '/messenger',
        method: 'PUT',
        body: { ids },
      }),

      async onQueryStarted({ ids, dialoguePartnerId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          messengerApi.util.updateQueryData('getChatMessages', dialoguePartnerId, (draft) => {
            draft.items.forEach((item) => {
              if (ids.includes(item.id)) {
                item.status = MessageStatus.READ
              }
            })
          })
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),
  }),
})

export const {
  useGetChatListQuery,
  useGetChatMessagesQuery,
  useDeleteMessageMutation,
  useUpdateMessageStatusMutation,
  useLazyGetOlderMessagesQuery,
  useLazyGetChatListQuery,
} = messengerApi
