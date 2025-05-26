import { getPost } from '@/app/(lib)/dataService'
import { PostModal } from '@/features/post/ui/postModal'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ postId: string }>
}

export default async function PostModalPage({ params }: Props) {
  const { postId } = await params

  const post = await getPost(postId)

  return <PostModal initialPost={post} />
}
