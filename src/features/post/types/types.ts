export const MAX_IMAGES = 10
export const MAX_FILE_SIZE_MB = 20
export const ACCEPTED_TYPES = ['image/jpeg', 'image/png']
export const MAX_DESCRIPTION_LENGTH = 500

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
