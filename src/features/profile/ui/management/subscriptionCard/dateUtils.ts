import { SubscriptionType } from '@/features/profile/api'

export const getNextPaymentDate = (dateOfPayment: string, type: SubscriptionType) => {
  const date = new Date(dateOfPayment)

  switch (type) {
    case 'DAY':
      date.setDate(date.getDate() + 1)
      break
    case 'WEEKLY':
      date.setDate(date.getDate() + 7)
      break
    case 'MONTHLY':
      date.setMonth(date.getMonth() + 1)
      break
  }

  return date
}
