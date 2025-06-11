export type PaymentRecord = {
  userId: number
  subscriptionId: string
  dateOfPayment: string
  endDateOfSubscription: string
  price: number
  subscriptionType: 'MONTHLY' | 'WEEKLY' | 'DAILY'
  paymentType: 'STRIPE' | 'PAYPAL'
}

export type CreatePaymentRequest = {
  typeSubscription: 'MONTHLY' | 'DAY' | 'WEEKLY'
  paymentType: 'STRIPE' | 'PAYPAL'
  amount: number
  baseUrl: string
}
