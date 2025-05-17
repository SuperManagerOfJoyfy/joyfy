export type Avatar = {
  url: string
  width: number
  height: number
  fileSize: number
  createdAt: string
}

export type MetaData = {
  following: number
  followers: number
  publications: number
}

export type PublicUserProfile = {
  id: number
  userName: string
  aboutMe: string | null
  avatars: Avatar[]
  userMetadata: MetaData
  hasPaymentSubscription: boolean
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
