import { PostItem } from '@/features/post/types/types'

export type GetAllPostsResponse = {
  pageSize: number
  totalCount: number
  notReadCount: number
  items: PostItem[]
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
