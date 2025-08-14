import { ChatArea } from '@/features/messenger/ui'

export default async function ChatPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params

  return <ChatArea />
}
