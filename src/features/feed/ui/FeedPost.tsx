'use client'

import { useState } from 'react'
import { PostReactions, PublicPostDropdownMenu } from '@/features/postModal/postViewMode'
import { DateStamp, ImageSlider, UserCard } from '@/shared/ui'
import { CommentsPopover } from './feedPostComment/CommentsPopover'
import { useGetCommentsQuery } from '@/features/comments/api/commentsApi'
import { usePostLike } from '@/features/post/hooks'
import { Post } from '@/features/post/types/postTypes'
import { PostLikes } from '@/entities/post/ui/postLikes/ui/PostLikes'
import s from './Feed.module.scss'

type Props = {
  post: Post
  isFollowing: boolean
}

export const FeedPost = ({ post, isFollowing }: Props) => {
  const user = { id: post.ownerId, userName: post.userName, avatar: post.avatarOwner }
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)

  const { myLike, count, likes, changeLikeStatus } = usePostLike(post.id)

  const { data: commentsData } = useGetCommentsQuery({
    postId: post.id,
    pageSize: 1,
    pageNumber: 1,
    sortBy: 'createdAt',
    sortDirection: 'desc',
  })

  const commentsCount = commentsData?.totalCount || 0

  const imageData = post.images?.map((img, idx) => ({
    src: img.url,
    alt: `Post image ${idx + 1}`,
  }))

  const handleCommentsClick = () => {
    setIsCommentsOpen(true)
  }

  return (
    <div className={s.feedPostContainer}>
      <div className={s.feedPostHeader}>
        <div className={s.dateWrapper}>
          <UserCard user={user} />
          <DateStamp date={post.createdAt} className={s.dateWithDot} />
        </div>
        <PublicPostDropdownMenu postId={post.id} ownerId={post.ownerId} isFollowing={isFollowing} />
      </div>

      <div className={s.imageWrapper}>
        <ImageSlider images={imageData} />
      </div>

      <PostReactions
        post={post}
        myLike={myLike}
        changeLikeStatus={changeLikeStatus}
        variant="feed"
        onCommentClick={handleCommentsClick}
      />

      <UserCard user={user} layout="inline" className={s.feedPostContent}>
        {post.description}
      </UserCard>

      {count > 0 && <PostLikes users={likes} count={count} className={s.postLikes} />}

      {commentsCount > 0 && (
        <button className={s.viewAllComments} onClick={handleCommentsClick} aria-label="View post comments">
          View All Comments ({commentsCount})
        </button>
      )}

      <CommentsPopover postId={post.id} open={isCommentsOpen} onOpenChange={setIsCommentsOpen} />
    </div>
  )
}
