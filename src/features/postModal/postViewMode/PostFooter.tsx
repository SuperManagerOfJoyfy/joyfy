import { Likes, useCreatePostLikeMutation, useGetPostLikesQuery } from '@/features/post/api'
import { PostReactions } from './PostReactions'
import { PostLikes } from '@/entities/post/ui/postLikes/ui/PostLikes'
import { DateStamp, Separator } from '@/shared/ui'
import { PostCommentForm } from '@/features/comments/ui/PostCommentForm'
import { useGetMeQuery } from '@/features/auth/api/authApi'
import { Post } from '@/features/post/types/postTypes'

import s from './PostViewMode.module.scss'

type PostFooterProps = {
  createdAt: string
  post: Post
}

export const PostFooter = ({ createdAt, post }: PostFooterProps) => {
  const { data: likes } = useGetPostLikesQuery(post.id)
  const { data: me } = useGetMeQuery()
  const [like] = useCreatePostLikeMutation()

  const users = likes?.items ?? []
  const count = likes?.totalCount ?? 0

  const myLike = !!users.find((user) => user.userId === me?.userId)

  const changeLikeStatus = async (action: Likes) => {
    try {
      if (me) {
        await like({ postId: post.id, likeStatus: action })
      } else {
        alert('You are not logged in')
      }
    } catch (error) {}
  }

  return (
    <div className={s.stickyFooter}>
      <PostReactions myLike={myLike} changeLikeStatus={changeLikeStatus} post={post} />

      {count > 0 && <PostLikes users={users} count={count} className={s.postLikes} />}

      <DateStamp date={createdAt} className={s.date} />

      <Separator />

      <PostCommentForm postId={post.id} />
    </div>
  )
}
