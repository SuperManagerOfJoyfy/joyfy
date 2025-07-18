import { baseQueryWithReauth } from '@/shared/api/baseQueryWithReauth'
import { createApi } from '@reduxjs/toolkit/query/react'

export const joyfyApi = createApi({
  reducerPath: 'joyfyApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Auth',
    'User',
    'Posts',
    'Profile',
    'Post',
    'Subscription',
    'PostLikes',
    'Payments',
    'Notifications',
    'Comment',
  ],
  endpoints: () => ({}),
})
