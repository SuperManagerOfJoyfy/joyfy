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

export type UserProfileWithFollowers = UserProfile & {
  isFollowing: boolean
  isFollowedBy: boolean
  followingCount: number
  followersCount: number
  publicationsCount: number
}

export type UploadedAvatarResponse = {
  avatars: AvatarType[]
}

export type UserFollowers = {
  totalCount: number
  pagesCount: number
  page: number
  pageSize: number
  prevCursor: number
  nextCursor: number
  items: UserFollowersItem[]
}

export type UserFollowersItem = {
  id: number
  userId: number
  userName: string
  createdAt: string
  avatars: AvatarType[]
  isFollowing: boolean
  isFollowedBy: boolean
}
