export const IMAGE_FILTERS = {
  normal: 'none',
  clarendon: 'contrast(125%) saturate(120%)',
  lark: 'brightness(110%) contrast(90%) saturate(110%)',
  gingham: 'contrast(90%) sepia(20%)',
  moon: 'grayscale(100%) contrast(110%) brightness(110%)',
  reyes: 'brightness(115%) contrast(85%) sepia(22%)',
  juno: 'saturate(160%) contrast(95%)',
  slumber: 'brightness(90%) contrast(110%) sepia(20%)',
  crema: 'saturate(85%) contrast(90%) brightness(115%)',
} as const

export type FilterKey = keyof typeof IMAGE_FILTERS
export const IMAGE_FILTERS_LIST = Object.keys(IMAGE_FILTERS) as FilterKey[]

export const ASPECT_RATIOS = ['original', '1:1', '4:5', '16:9'] as const

export type FilterType = keyof typeof IMAGE_FILTERS
export type AspectRatioType = (typeof ASPECT_RATIOS)[number]

export type PostCreationStep = 'upload' | 'crop' | 'filter' | 'description'
export type AvatarCreationStep = 'upload' | 'position'

export type Image = {
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

export type Post = {
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
