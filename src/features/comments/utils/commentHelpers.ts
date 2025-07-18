import { Comment, CommentAuthor } from '../api/commentsApi.types'

export const mapCommentAuthorToUser = (author: CommentAuthor) => ({
  id: author.id,
  userName: author.username,
  avatar: author.avatars?.[0]?.url || '',
})

export const sortCommentsByUserPriority = (comments: Comment[], currentUserId?: number) => {
  return [...comments].sort((a, b) => {
    if (currentUserId) {
      const aIsCurrentUser = a.from.id === currentUserId
      const bIsCurrentUser = b.from.id === currentUserId

      if (aIsCurrentUser && !bIsCurrentUser) return -1
      if (!aIsCurrentUser && bIsCurrentUser) return 1
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}
