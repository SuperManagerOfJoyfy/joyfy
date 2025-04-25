export const FILTERS = [
  'Normal',
  'Clarendon',
  'Gingham',
  'Moon',
  'Lark',
  'Reyes',
  'Juno',
  'Slumber',
  'Crema',
  'Ludwig',
  'Aden',
  'Perpetua',
] as const

export const ASPECT_RATIOS = ['1:1', '4:5', '16:9'] as const

export type FilterType = (typeof FILTERS)[number]
export type AspectRatioType = (typeof ASPECT_RATIOS)[number]

export type PostCreationStep = 'upload' | 'crop' | 'filter' | 'description'

export type PublishData = {
  files: File[]
  description: string
  aspectRatio?: AspectRatioType
  filter?: FilterType
  zoom?: number
}

export type DraftData = {
  aspectRatio: AspectRatioType
  filter: FilterType
  zoom: number
  timestamp: number
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