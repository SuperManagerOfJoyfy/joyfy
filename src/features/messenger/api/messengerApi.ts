import { joyfyApi } from '@/shared/api/joyfyApi'
import { ChatResponse, MessageRequest, MessageResponse, MessageItem, MessageStatus } from './messengerApi.types'
import { getSocket } from '@/shared/config/socket'
import { WS_EVENT_PATH } from '@/shared/constants'
import { selectCurrentUserId } from '@/features/auth/model/authSlice'
import { store } from '@/app/store/store'

export const messengerApi = joyfyApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getChatList: builder.query<ChatResponse, void>({
      query: () => ({
        url: '/messenger',
      }),
      providesTags: ['ChatList'],
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
        const socket = getSocket()
        if (!socket) return

        const currentUserId = selectCurrentUserId(store.getState())
        console.log(currentUserId)

        await cacheDataLoaded

        const handleReceiveMessage = (message: MessageItem) => {
          updateCachedData((draft) => {
            const idx = draft.items.findIndex((m) => m.id === message.id)
            const isCurrentChat =
              (message.ownerId === currentUserId && message.receiverId === +dialoguePartnerId) ||
              (message.ownerId === +dialoguePartnerId && message.receiverId === currentUserId)

            if (!isCurrentChat) return

            if (idx !== -1) {
              // Update the message status and other fields if needed
              draft.items[idx] = { ...draft.items[idx], ...message }
            } else {
              // Add new message if not present
              draft.items.push(message)
              draft.totalCount += 1

              // Invalidate ChatList tag to add a new chat after first message is added
              if (draft.items.length === 1) {
                store.dispatch(messengerApi.util.invalidateTags(['ChatList']))
              }
            }
          })
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

        socket.on(WS_EVENT_PATH.RECEIVE_MESSAGE, handleReceiveMessage)
        socket.on(WS_EVENT_PATH.MESSAGE_DELETED, handleDeleteMessage)
        socket.on(WS_EVENT_PATH.UPDATE_MESSAGE, handleUpdateMessage)

        await cacheEntryRemoved
        socket.off(WS_EVENT_PATH.RECEIVE_MESSAGE, handleReceiveMessage)
        socket.off(WS_EVENT_PATH.MESSAGE_DELETED, handleDeleteMessage)
        socket.off(WS_EVENT_PATH.UPDATE_MESSAGE, handleUpdateMessage)
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
              messengerApi.util.updateQueryData('getChatList', undefined, (chatDraft) => {
                chatDraft.items = chatDraft.items.filter(
                  (m) => m.ownerId !== +dialoguePartnerId && m.receiverId !== +dialoguePartnerId
                )
                chatDraft.totalCount -= 1
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
} = messengerApi
