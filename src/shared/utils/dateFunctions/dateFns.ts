import { differenceInYears, format, formatDistanceToNow, isValid, parse, parseISO, subDays } from 'date-fns'

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

export const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null
  const parsed = parse(dateString, 'dd.MM.yyyy', new Date())
  return isValid(parsed) ? parsed : null
}

export const formatDateOfBirth = (isoString: string | undefined): string => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return format(date, 'dd.MM.yyyy')
}

export const convertDateToString = (date: Date | null) => {
  return date ? format(date, 'dd.MM.yyyy') : ''
}

export const convertToISOString = (dateString?: string): string | undefined => {
  if (!dateString) return undefined

  const parsedDate = parse(dateString, 'dd.MM.yyyy', new Date())
  if (!isValid(parsedDate)) return undefined

  return parsedDate.toISOString()
}

export const calculateAge = (dateString: string) => {
  const [day, month, year] = dateString.split('.').map(Number)

  const dob = new Date(year, month - 1, day)
  if (isNaN(dob.getTime())) return false
  return differenceInYears(new Date(), dob) >= 13
}
