import { AspectRatioType, FilterType } from '@/features/post/types/postTypes'

export type ImageItem = {
  id: string
  src: string
  originalSrc?: string
}

export type ImageEditData = {
  scale: number
  imageFilter: FilterType
  aspectRatio: AspectRatioType
}

export type DraftData = {
  id: string
  userId: number
  description: string
  images: ImageItem[]
  imagesEditData: ImageEditData[]
  imagePreviews: string[]
  imagesBlobs: Array<{ index: number; blob: Blob }>
  createdAt: number
  updatedAt: number
}

export type CanvasDimensions = {
  width: number
  height: number
}

export type CropParams = {
  x: number
  y: number
  width: number
  height: number
}

export type DrawParams = {
  image: HTMLImageElement
  crop: CropParams
  canvas: HTMLCanvasElement
  scale: number
  filter: string
}
