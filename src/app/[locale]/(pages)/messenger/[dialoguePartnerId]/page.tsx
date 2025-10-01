import { fetchUserProfile } from '@/features/messenger/api'
import { ChatArea } from '@/features/messenger/ui'
import { setRequestLocale } from 'next-intl/server'

export default async function ChatPage({ params }: { params: Promise<{ locale: string; dialoguePartnerId: string }> }) {
  const { locale, dialoguePartnerId } = await params
  setRequestLocale(locale)

  const userProfile = await fetchUserProfile(dialoguePartnerId)

  const user = {
    id: userProfile.id,
    userName: userProfile.userName,
    avatar: userProfile.avatars?.[0]?.url ?? null,
  }

  return <ChatArea selectedUser={user} dialoguePartnerId={dialoguePartnerId} />
}
