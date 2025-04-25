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

export type Item = {
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

export type GetAllPostsResponse = {
  pageSize: number
  totalCount: number
  notReadCount: number
  items: Item[]
}
export type CreatePostRequest = {
  description: string
  childrenMetadata: { uploadId: string }[]
}

export type UploadImageResponse = {
  images: {
    url: string
    width: number
    height: number
    fileSize: number
    createdAt: string
    uploadId: string
  }[]
}
