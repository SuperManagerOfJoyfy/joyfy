import { PostModal } from '@/features/postModal/ui'
import { PublicUserProfile } from '@/features/profile/api'
import { notFound } from 'next/navigation'

type PageProps = {
  params: Promise<{ id: string; postId: string }>
}

// This component intercepts /user/[id]/post/[postId] when navigating from within the app

export default async function InterceptedPostModal({ params }: PageProps) {
  const { id, postId } = await params

  let post = null

  if (postId) {
    const postRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public-posts/${postId}`)
    post = await postRes.json()
  }

  const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public-user/profile/${id}`)

  const userData: PublicUserProfile = await userRes.json()

  if (!userRes.ok) notFound()

  return (
    <PostModal
      userProfile={{ userId: userData.id, userName: userData.userName }}
      initialPost={post}
      isIntercepted={true}
      postId={Number(postId)}
    />
  )
}
