import { Typography } from '@/shared/ui'
import { AuthGuard } from '@/features/auth/ui'
import { UserSearch } from '@/features/userSearch/ui'

export default function Search() {
  return (
    <AuthGuard requireAuth>
      <Typography variant="h1">Search</Typography>
      <UserSearch />
    </AuthGuard>
  )
}
