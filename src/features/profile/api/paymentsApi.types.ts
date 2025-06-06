export type PaymentRecord = {
  userId: number
  subscriptionId: string
  dateOfPayment: string
  endDateOfSubscription: string
  price: number
  subscriptionType: 'MONTHLY' | 'WEEKLY' | 'DAILY'
  paymentType: 'STRIPE' | 'PAYPAL'
}
