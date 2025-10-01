import { Suspense } from 'react'
import { Loader } from '@/shared/ui/loader/Loader'
import { GoogleOAuthSuccess } from '@/features/auth/ui'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function OauthLoginSuccessPage() {
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <GoogleOAuthSuccess />
    </Suspense>
  )
}
