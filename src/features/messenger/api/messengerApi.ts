import { joyfyApi } from '@/shared/api/joyfyApi'
import { BaseMessage } from './messengerApi.types'

export const messengerApi = joyfyApi.injectEndpoints({
  endpoints: (bulder) => ({
    getChatList: bulder.query<BaseMessage, void>({
      query: () => ({
        url: '/messenger',
      }),
    }),
    getChatMessages: bulder.query<BaseMessage, string>({
      query: (dialoguePartnerId) => ({
        url: `/messenger/${dialoguePartnerId}`,
      }),
    }),
  }),
})

export const { useGetChatListQuery, useGetChatMessagesQuery } = messengerApi
