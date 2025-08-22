type Params = {
  text: string
  ownerId: number
  currentUserId: number
}

export const modifyMessage = ({ text, ownerId, currentUserId }: Params) => {
  const words = text.split(' ') ?? []
  const isModified = words.length > 4
  const preview = words.slice(0, 4).join(' ')
  const displayText =
    ownerId === currentUserId ? `You: ${preview} ${isModified ? '...' : ''}` : `${preview} ${isModified ? '...' : ''}`

  return displayText
}
