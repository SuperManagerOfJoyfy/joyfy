import { User } from '@/entities/user/types/userTypes'

export type Comment = {
  id: number
  postId: number
  from: User
  content: string
  createdAt: string
  answerCount: number
  likeCount: number
  isLiked: boolean
}

export type Answer = {
  id: number
  commentId: number
  from: User
  content: string
  createdAt: string
  likeCount: number
  isLiked: boolean
}
