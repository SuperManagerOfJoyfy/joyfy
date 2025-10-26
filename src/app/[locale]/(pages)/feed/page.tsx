import { AuthGuard } from '@/features/auth/ui'
import { Feed } from '@/features/feed/ui/Feed'

export default function Page() {
  return (
    <AuthGuard requireAuth={true}>
      <Feed />
    </AuthGuard>
  )
}
