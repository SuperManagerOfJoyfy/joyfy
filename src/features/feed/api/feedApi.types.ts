import { Post } from '@/features/post/types/postTypes'

export type FeedResponse = {
  totalCount: number
  pagesCount: number
  page: number
  pageSize: number
  prevCursor: number
  nextCursor: number
  items: Post[]
}

export type FeedQueryParams = {
  endCursorPostId?: number
  pageSize?: number
}
