import { AvatarType } from '@/features/profile/api'

export type UserItem = {
  id: number
  userName: string
  firstName: string
  lastName: string
  avatars: AvatarType[]
  createdAt: string
}

export type GetUsersResponse = {
  totalCount: number
  pagesCount: number
  page: number
  pageSize: number
  prevCursor: number | null
  nextCursor: number | null
  items: UserItem[]
}

export type UsersQueryParams = {
  search: string
  pageSize?: number
  pageNumber?: number
  cursor?: number
}
