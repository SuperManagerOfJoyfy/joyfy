import { Post } from '@/features/post/types/postTypes'

export type GetPostsResponse = {
  totalCount: number
  pageSize: number
  totalUsers: number
  items: Post[]
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
  userId?: number
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
