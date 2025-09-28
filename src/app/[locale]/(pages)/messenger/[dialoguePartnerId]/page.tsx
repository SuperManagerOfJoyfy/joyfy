import { fetchUserProfile } from '@/features/messenger/api'
import { ChatArea } from '@/features/messenger/ui'

type Props = { params: Promise<{ dialoguePartnerId: string }> }

export default async function ChatPage({ params }: Props) {
  const { dialoguePartnerId } = await params

  const userProfile = await fetchUserProfile(dialoguePartnerId)

  const user = { id: userProfile.id, userName: userProfile.userName, avatar: userProfile.avatars?.[0]?.url }

  return <ChatArea selectedUser={user} dialoguePartnerId={dialoguePartnerId} />
}
