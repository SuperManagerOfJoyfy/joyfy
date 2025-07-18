import { LikeStatus } from '../api/commentsApi.types'

export const applyLikeChange = (item: { isLiked: boolean; likeCount: number }, likeStatus: LikeStatus) => {
  const wasLiked = item.isLiked
  const newIsLiked = likeStatus === 'LIKE'

  item.isLiked = newIsLiked

  if (wasLiked && !newIsLiked) {
    item.likeCount = Math.max(0, item.likeCount - 1)
  } else if (!wasLiked && newIsLiked) {
    item.likeCount += 1
  }
}
