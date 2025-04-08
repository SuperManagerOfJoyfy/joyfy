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
