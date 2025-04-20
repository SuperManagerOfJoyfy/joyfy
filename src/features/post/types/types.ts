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

export type CreatePostRequest = {
  description: string
}

export type PostResponse = {
  postId: string
  username: string
  userId: string
  description: string
  createdAt: string
  updatedAt: string
}
