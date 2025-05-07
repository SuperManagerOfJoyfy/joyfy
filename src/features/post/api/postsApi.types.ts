import { PostItem } from '@/features/post/types/types'

export type GetAllPostsResponse = {
  pageSize: number
  page: number
  pagesCount: number
  totalCount: number
  items: PostItem[]
}

export type PostsQueryParams = {
  userName: string
  pageSize?: number
  pageNumber?: number
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
