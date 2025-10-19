'use client'

import { useTranslations } from 'next-intl'
import { Post } from '@/features/post/types/postTypes'
import { LazyLoader, Loader } from '@/shared/ui'
import { FeedPost } from './FeedPost'
import { useGetMeQuery } from '@/features/auth/api/authApi'
import { useGetUserFollowingQuery } from '@/features/profile/api'
import { useGetFeedPostsQuery, useLazyGetFeedPostsQuery } from '../api/feedApi'
import s from './Feed.module.scss'

export const Feed = () => {
  const t = useTranslations('feed')
  const { data: feedData, isLoading } = useGetFeedPostsQuery({})
  const [fetchMore, { isFetching: isLoadingMore }] = useLazyGetFeedPostsQuery()
  const { data: me } = useGetMeQuery()
  const { data: followingData } = useGetUserFollowingQuery(me?.userName || '', { skip: !me?.userName })

  const feedPosts = feedData?.items || []
  const followingIds = new Set(followingData?.items?.map((user) => user.userId) || [])

  const hasMore = feedData ? feedPosts.length < feedData.totalCount : false

  const handleFetchMore = async () => {
    const lastId = feedPosts.at(-1)?.id

    if (lastId && !isLoadingMore) {
      try {
        await fetchMore({ endCursorPostId: lastId }).unwrap()
      } catch (error) {
        console.error('Error loading more posts:', error)
      }
    }
  }

  if (isLoading) return <Loader />

  if (!feedPosts || feedPosts.length === 0) {
    return <div className={s.noPostsMsg}>{t('empty')}</div>
  }

  return (
    <div className={s.feedContainer}>
      {feedPosts.map((post: Post) => (
        <FeedPost post={post} key={post.id} isFollowing={followingIds.has(post.ownerId)} />
      ))}

      <LazyLoader onLoadMore={handleFetchMore} hasMore={hasMore} isFetching={isLoadingMore} />
    </div>
  )
}
