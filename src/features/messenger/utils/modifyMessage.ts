type Params = {
  text: string
  ownerId: number
  currentUserId: number
  youLabel?: string
}

export const modifyMessage = ({ text, ownerId, currentUserId, youLabel = 'You' }: Params) => {
  const words = text.split(' ') ?? []
  const isModified = words.length > 4
  const preview = words.slice(0, 4).join(' ')
  const displayText =
    ownerId === currentUserId
      ? `${youLabel}: ${preview}${isModified ? '...' : ''}`
      : `${preview}${isModified ? '...' : ''}`

  return displayText
}
