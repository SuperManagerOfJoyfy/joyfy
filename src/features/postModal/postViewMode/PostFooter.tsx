import { Likes, useCreatePostLikeMutation, useGetPostLikesQuery } from '@/features/post/api'
import { PostReactions } from './PostReactions'
import { PostLikes } from '@/entities/post/ui/postLikes/ui/PostLikes'
import { DateStamp, Separator } from '@/shared/ui'

import { PostCommentForm } from '@/features/comments/ui/PostCommentForm'

import s from './PostViewMode.module.scss'
import { useGetMeQuery } from '@/features/auth/api/authApi'

type PostFooterProps = {
  postId: number
  createdAt: string
}

export const PostFooter = ({ postId, createdAt }: PostFooterProps) => {
  const { data: likes } = useGetPostLikesQuery(postId)
  const { data: me } = useGetMeQuery()
  const [like] = useCreatePostLikeMutation()

  const users = likes?.items ?? []
  const count = likes?.totalCount ?? 0

  const myLike = !!users.find((user) => user.userId === me?.userId)

  const changeLikeStatus = async (action: Likes) => {
    try {
      if (me) {
        await like({ postId, likeStatus: action })
      } else {
        alert('You are not logged in')
      }
    } catch (error) {}
  }

  return (
    <div className={s.stickyFooter}>
      <PostReactions myLike={myLike} changeLikeStatus={changeLikeStatus} />

      {count > 0 && <PostLikes users={users} count={count} className={s.postLikes} />}

      <DateStamp date={createdAt} className={s.date} />

      <Separator />

      <PostCommentForm postId={postId} />
    </div>
  )
}
