import { PostItem } from '@/features/post/types/types'

export type GetPostsResponse = {
  totalCount: number
  pageSize: number
  totalUsers: number
  items: PostItem[]
}

export type PostsQueryParams = {
  userId: number
  endCursorPostId?: number
  pageSize?: number
  sortBy?: string
  sortDirection?: string
}

export type CreatePostRequest = {
  description: string
  childrenMetadata: { uploadId: string }[]
}

export type UploadImageResponse = {
  images: {
    url: string
    width: number
    height: number
    fileSize: number
    createdAt: string
    uploadId: string
  }[]
}
