import { NotFoundContent } from '@/shared/ui'

export default function RootNotFound() {
  return (
    <NotFoundContent
      title="Page Not Found"
      description="The page you are looking for doesn't exist or has been moved."
      buttonText="Go Home"
      href="/en"
    />
  )
}
