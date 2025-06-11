import { PaymentRecord } from '@/features/profile/api'

export const formatters = {
  date: (dateString: string): string => {
    return new Date(dateString)
      .toLocaleDateString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      .replace(/\//g, '.')
  },

  subscriptionType: (type: PaymentRecord['subscriptionType']): string => {
    const typeMap: Record<PaymentRecord['subscriptionType'], string> = {
      MONTHLY: '1 month',
      WEEKLY: '7 days',
      DAILY: '1 day',
    }
    return typeMap[type] || type.toLowerCase()
  },

  paymentType: (type: PaymentRecord['paymentType']): string => {
    return type === 'STRIPE' ? 'Stripe' : 'PayPal'
  },

  currency: (price: number): string => {
    return `$${Math.round(price)}`
  },
}
