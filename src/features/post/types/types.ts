export const IMAGE_FILTERS = {
  Normal: 'none',
  Clarendon: 'contrast(125%) saturate(120%)',
  Lark: 'brightness(110%) contrast(90%) saturate(110%)',
  Gingham: 'contrast(90%) sepia(20%)',
  Moon: 'grayscale(100%) contrast(110%) brightness(110%)',
  Reyes: 'brightness(115%) contrast(85%) sepia(22%)',
  Juno: 'saturate(160%) contrast(95%)',
  Slumber: 'brightness(90%) contrast(110%) sepia(20%)',
  Crema: 'saturate(85%) contrast(90%) brightness(115%)',
} as const

export const IMAGE_FILTERS_LIST = Object.keys(IMAGE_FILTERS) as Array<keyof typeof IMAGE_FILTERS>

export const ASPECT_RATIOS = ['original', '1:1', '4:5', '16:9'] as const

export type FilterType = keyof typeof IMAGE_FILTERS
export type AspectRatioType = (typeof ASPECT_RATIOS)[number]

export type PostCreationStep = 'upload' | 'crop' | 'filter' | 'description'

export type ImageSettings = {
  aspectRatio: AspectRatioType
  filter: FilterType
  zoom: number
}

export type PublishData = {
  files: File[]
  description: string
  imageSettings: ImageSettings[]
}

export type DraftData = {
  step?: PostCreationStep
  timestamp: number
  currentImageIndex?: number
  description?: string
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

export type LikeInfo = {
  id: number
  userId: number
  userName: string
  createdAt: string
  avatars: Omit<Image, 'uploadId'>[]
  isFollowing: boolean
  isFollowedBy: boolean
}

export type PostLikes = {
  pageSize: number
  totalCount: number
  notReadCount: number
  items: LikeInfo[]
}
