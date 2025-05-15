export type Avatar = {
  url: string
  width: number
  height: number
  fileSize: number
  createdAt: string
}

export type UserProfile = {
  id: number
  userName: string
  firstName: string
  lastName: string
  city: string
  country: string
  region: string
  dateOfBirth: string
  aboutMe: string
  avatars: Avatar[]
  createdAt: string
}
