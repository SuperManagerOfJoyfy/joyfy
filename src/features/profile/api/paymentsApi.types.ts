export type PaymentRecord = {
  userId: number
  subscriptionId: string
  dateOfPayment: string
  endDateOfSubscription: string
  price: number
  subscriptionType: SubscriptionType
  paymentType: PaymentType
}

export type CurrentSubscription = {
  data: {
    userId: number
    subscriptionId: string
    dateOfPayment: string
    endDateOfSubscription: string
    autoRenewal: boolean
  }[]
  hasAutoRenewal: boolean
}

export type CreatePaymentRequest = {
  typeSubscription: SubscriptionType
  paymentType: PaymentType
  amount: number
  baseUrl: string
}

export type AccountType = 'Personal' | 'Business'

export enum SubscriptionType {
  MONTHLY = 'MONTHLY',
  WEEKLY = 'WEEKLY',
  DAY = 'DAY',
}

export enum PaymentType {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
}
