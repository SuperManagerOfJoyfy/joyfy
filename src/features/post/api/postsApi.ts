import { GetAllPostsResponse } from "@/features/post/api/postsApi.types"
import { joyfyApi } from "@/shared/api/joyfyApi"

export const postsApi = joyfyApi.injectEndpoints({
	endpoints: (builder) => ({
		getAllPosts: builder.query<GetAllPostsResponse, {userName: string}>({
			query: ({userName}) => ({
				url: `/posts/${userName}`,
				method: 'GET',
			}),
			providesTags: ['Posts'],
		}),
  }),
})

export const {useGetAllPostsQuery} = postsApi