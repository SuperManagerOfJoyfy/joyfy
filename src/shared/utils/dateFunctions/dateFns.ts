import { differenceInYears, format, formatDistanceToNow, isValid, parse, parseISO, subDays } from 'date-fns'

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
  return format(d, 'MMMM d, yyyy') // e.g., May 14, 1981
}

export const formatSmartDate = (dateStr: string): string => {
  const date = parseISO(dateStr)
  const recent = subDays(new Date(), 2)

  return date > recent ? timeAgo(date) : formatReadableDate(date)
}

export const calculateAge = (dateStr: string): boolean => {
  const parsed = parseDateString(dateStr)
  if (!parsed) return false
  return differenceInYears(new Date(), parsed) >= 13
}
