import { format, formatDistanceToNow, parseISO, subDays } from 'date-fns'

export const timeAgoFn = (date: string) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const formatDate = (date: string) => {
  return format(new Date(date), 'MMMM d, yyyy')
}

export const formatSmartDate = (dateString: string) => {
  const date = parseISO(dateString)
  const twoDaysAgo = subDays(new Date(), 2)

  if (date > twoDaysAgo) {
    return timeAgoFn(dateString)
  }

  return formatDate(dateString)
}
