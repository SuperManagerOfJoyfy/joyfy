import { selectUserName } from '@/features/auth/model/authSlice'
import { useGetAllPostsQuery } from '@/features/post/api/postsApi'
import { PostsGrid } from '@/features/post/ui/createPost/postsGrid/PostsGrid'
import { skipToken } from '@reduxjs/toolkit/query'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

export const PostsGridWithInfinteScroll = () => {

	const userName = useSelector(selectUserName)
	const { data } = useGetAllPostsQuery(userName ? { userName } : skipToken)

	const posts = data?.items

	if (!posts || posts.length === 0) return <div>No posts yet...</div>;

	return (
		<div>
			<PostsGrid posts={posts}/>
		</div>
	)
}