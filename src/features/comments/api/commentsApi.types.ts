export type CommentAuthor = {
  id: number
  username: string
  avatars: { url: string }[]
}

export type Comment = {
  id: number
  postId: number
  from: CommentAuthor
  content: string
  createdAt: string
  answerCount: number
  likeCount: number
  isLiked: boolean
}

export type Answer = {
  id: number
  commentId?: number
  from: CommentAuthor
  content: string
  createdAt: string
  likeCount: number
  isLiked: boolean
}
export type LikeStatus = 'LIKE' | 'DISLIKE' | 'NONE'

type PaginatedResponse<T> = {
  pageSize: number
  totalCount: number
  notReadCount: number
  items: T[]
}

export type CommentResponse = PaginatedResponse<Comment>
export type AnswerResponse = PaginatedResponse<Answer>

export type LikeableItem = Comment | Answer
