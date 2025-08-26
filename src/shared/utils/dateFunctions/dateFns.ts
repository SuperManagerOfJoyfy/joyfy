import {
  differenceInDays,
  differenceInYears,
  format,
  formatDistanceToNow,
  isToday,
  isValid,
  parse,
  parseISO,
  subDays,
} from 'date-fns'

// --- Shared helpers ---

const DATE_FORMAT = 'dd.MM.yyyy'

export const parseDateString = (dateStr?: string): Date | null => {
  if (!dateStr?.trim()) return null
  const parsed = parse(dateStr, DATE_FORMAT, new Date())
  return isValid(parsed) ? parsed : null
}

export const formatDateToString = (date?: Date | null): string => {
  return date && isValid(date) ? format(date, DATE_FORMAT) : ''
}

export const toISOString = (dateStr?: string): string | undefined => {
  const parsed = parseDateString(dateStr)
  return parsed ? parsed.toISOString() : undefined
}

// --- UI-friendly formatting ---

export const timeAgo = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(d, { addSuffix: true }).replace('about ', '')
}

export const formatReadableDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  if (!isValid(d)) return ''
  return format(d, 'MMMM d, yyyy') // e.g., May 14, 1981
}

export const formatSmartDate = (dateStr: string): string => {
  if (!dateStr) return ''
  const date = parseISO(dateStr)
  if (!isValid(date)) return ''
  const recent = subDays(new Date(), 2)

  return date > recent ? timeAgo(date) : formatReadableDate(date)
}

export const calculateAge = (dateStr: string): boolean => {
  const parsed = parseDateString(dateStr)
  if (!parsed) return false
  return differenceInYears(new Date(), parsed) >= 13
}

export const formatChatTimestamp = (dateStr: string): string => {
  const date = parseISO(dateStr)
  const daysDiff = differenceInDays(new Date(), date)

  if (daysDiff < 1) {
    return format(date, 'HH:mm') // 24hr format
  }

  if (daysDiff < 2) {
    return format(date, 'EEE') // Day of week, e.g. Mon, Tue
  }
  return format(date, 'd MMM') // e.g., 28 Sep
}
