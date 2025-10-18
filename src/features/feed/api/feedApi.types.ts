import { Post } from '@/features/post/types/postTypes'
import { PaginatedResponse } from '@/features/profile/api/profileApi.types'

export type FeedResponse = PaginatedResponse<Post>

export type FeedQueryParams = {
  endCursorPostId?: number
  pageSize?: number
}
