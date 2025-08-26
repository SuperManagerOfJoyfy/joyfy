import { PublicUserProfile } from '@/features/profile/api'

export const fetchUserProfile = async (userId: string): Promise<PublicUserProfile> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public-user/profile/${userId}`)
  if (!res.ok) throw new Error('Failed to fetch user profile')
  return res.json()
}
