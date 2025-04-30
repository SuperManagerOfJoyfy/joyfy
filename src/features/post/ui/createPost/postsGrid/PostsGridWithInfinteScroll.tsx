'use client'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useGetAllPostsQuery } from '@/features/post/api/postsApi'
import { PostsGrid } from '@/features/post/ui/createPost/postsGrid/PostsGrid'
import { Loader } from '@/shared/ui/loader/Loader'
import { skipToken } from '@reduxjs/toolkit/query'

export const PostsGridWithInfinteScroll = () => {
  const { user } = useAuth()
  const { data, isLoading } = useGetAllPostsQuery(user ? { userName: user.userName } : skipToken)

  const posts = data?.items
  if (isLoading) return <Loader />
  if (!posts || posts.length === 0) return <div>No posts yet...</div>

  return (
    <div>
      <PostsGrid posts={posts} />
    </div>
  )
}
