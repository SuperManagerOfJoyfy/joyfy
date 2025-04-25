export type PostImage = {
  id: string
  file: File
  url: string
  filter?: string
  aspectRatio?: '1:1' | '4:5' | '16:9'
  zoom?: number
}

export type PostDraft = {
  images: PostImage[]
  description: string
  currentStep: number
}


type Image = {
	url: string
	width: number
	height: number
	fileSize: number
	createdAt: string
	uploadId: string
}

type Owner = {
	firstName: string
	lastName: string
}

export type PostItem = {
	id: number
	userName: string
	description: string
	location: string
	images: Image[]
	createdAt: string
	updatedAt: string
	ownerId: number
	avatarOwner: string
	owner: Owner
	likesCount: number
	isLiked: boolean
	avatarWhoLikes: boolean
}