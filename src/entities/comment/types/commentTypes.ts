export type Comment = {
  id: number
  postId: number
  from: {
    id: number
    username: string
    avatars: [{ url: string }] // TODO: find out if it contains url
  }
  content: string
  createdAt: string
  answerCount: number
  likeCount: number
  isLiked: boolean
}

export type CommentResponse = {
  pageSize: number
  totalCount: number
  notReadCount: number
  items: Comment[]
}
