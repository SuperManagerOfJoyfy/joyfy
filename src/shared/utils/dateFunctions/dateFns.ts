import { format, formatDistanceToNow } from 'date-fns'

export const timeAgoFn = (date: string) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const formatDate = (date: string) => {
  return format(new Date(date), 'MMMM d, yyyy')
}
