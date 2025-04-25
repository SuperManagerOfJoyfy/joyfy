import { PostItem } from "@/features/post/types/types"


export type GetAllPostsResponse= {
	pageSize: number
	totalCount: number
	notReadCount: number
	items: PostItem[]
}