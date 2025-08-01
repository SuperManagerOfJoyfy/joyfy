export type AvatarType = {
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
  avatars: AvatarType[]
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
  avatars: AvatarType[]
  createdAt: string
}

export type UserProfileWithFollowers = {
  id: number
  userName: string
  firstName: string
  lastName: string
  city: string
  country: string
  region: string
  dateOfBirth: string
  aboutMe: string
  avatars: AvatarType[]
  isFollowing: boolean
  isFollowedBy: boolean
  followingCount: number
  followersCount: number
  publicationsCount: number
}

export type UploadedAvatarResponse = {
  avatars: AvatarType[]
}
