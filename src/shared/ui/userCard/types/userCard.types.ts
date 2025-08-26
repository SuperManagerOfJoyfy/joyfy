export type User = {
  id: number
  userName: string
  avatar?: string
}

export type AvatarUser = {
  userName: string
  avatars: { url: string }[]
}
