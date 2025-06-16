import { Image } from '@/features/post/types/postTypes'

export type LikeInfo = {
  id: number
  userId: number
  userName: string
  createdAt: string
  avatars: Omit<Image, 'uploadId'>[]
  isFollowing: boolean
  isFollowedBy: boolean
}

export type PostLikes = {
  pageSize: number
  totalCount: number
  notReadCount: number
  items: LikeInfo[]
}
