export type PaymentRecord = {
  userId: number
  subscriptionId: string
  dateOfPayment: string
  endDateOfSubscription: string
  price: number
  subscriptionType: SubscriptionType
  paymentType: 'STRIPE' | 'PAYPAL'
}

export type CreatePaymentRequest = {
  typeSubscription: SubscriptionType
  paymentType: 'STRIPE' | 'PAYPAL'
  amount: number
  baseUrl: string
}

export enum SubscriptionType {
  MONTHLY = 'MONTHLY',
  WEEKLY = 'WEEKLY',
  DAY = 'DAY',
}
