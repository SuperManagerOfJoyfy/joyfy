import { useGetMeQuery } from '@/features/auth/api/authApi'
import { Likes, useCreatePostLikeMutation, useGetPostLikesQuery } from '../api'
import { useTranslations } from 'next-intl'

export const usePostLike = (postId: number) => {
  const { data: likes } = useGetPostLikesQuery(postId)
  const { data: me } = useGetMeQuery() // ✅ Query here
  const [like] = useCreatePostLikeMutation()
  const t = useTranslations('post')

  const users = likes?.items ?? []
  const count = likes?.totalCount ?? 0
  const myLike = !!users.find((user) => user.userId === me?.userId)

  const changeLikeStatus = async (action: Likes) => {
    try {
      if (me) {
        await like({ postId, likeStatus: action })
      } else {
        alert(t('notLoggedIn'))
      }
    } catch (error) {}
  }

  return {
    likes: users,
    count,
    myLike,
    changeLikeStatus,
  }
}
