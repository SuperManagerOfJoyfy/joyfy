export type FilterType =
  | 'Normal'
  | 'Clarendon'
  | 'Gingham'
  | 'Moon'
  | 'Lark'
  | 'Reyes'
  | 'Juno'
  | 'Slumber'
  | 'Crema'
  | 'Ludwig'
  | 'Aden'
  | 'Perpetua'


export type AspectRatioType = '1:1' | '4:5' | '16:9'

export type PostImage = {
  id: string
  file: File
  url: string
  filter?: FilterType
  aspectRatio?: AspectRatioType
  zoom?: number
}

export type PostDraft = {
  images: PostImage[]
  description: string
  currentStep: number
}

export type CreatePostRequest =
  | FormData
  | {
      description: string
    }

export type CreatePostWithImageRequest = {
  image: File
  description: string
  filter?: FilterType
  aspectRatio?: AspectRatioType
  zoom?: number
}

export type PostResponse = {
  postId: string
  username: string
  userId: string
  description: string
  createdAt: string
  updatedAt: string
  images?: string[]
}

export type PostCreationStep = 'upload' | 'crop' | 'filter' | 'description'

export type ConfirmationDialogProps = {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  message: string
}
