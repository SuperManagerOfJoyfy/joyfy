import { joyfyApi } from '@/shared/api/joyfyApi'
import { CreatePaymentRequest, CurrentSubscription, PaymentRecord } from './paymentsApi.types'

export const paymentsApi = joyfyApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyPayments: builder.query<PaymentRecord[], void>({
      query: () => ({
        url: '/subscriptions/my-payments',
      }),
      providesTags: ['Payments'],
    }),
    getCurrentSubscription: builder.query<CurrentSubscription, void>({
      query: () => ({
        url: 'subscriptions/current-payment-subscriptions',
      }),
      transformResponse: (response: CurrentSubscription) => ({
        ...response,
        accountType: response.data.length ? 'Business' : 'Personal',
      }),
      providesTags: ['Subscription'],
    }),
    createPayment: builder.mutation<{ url: string }, CreatePaymentRequest>({
      query: (body) => ({
        body,
        url: '/subscriptions',
        method: 'POST',
      }),
    }),
    cancelAutoRenewal: builder.mutation<void, void>({
      query: () => ({
        url: '/subscriptions/canceled-auto-renewal',
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
    }),
    renewAutoRenewal: builder.mutation<void, void>({
      query: () => ({
        url: '/subscriptions/renew-auto-renewal',
        method: 'POST',
      }),
      invalidatesTags: ['Subscription'],
    }),
  }),
  overrideExisting: true,
})

export const {
  useGetMyPaymentsQuery,
  useCreatePaymentMutation,
  useGetCurrentSubscriptionQuery,
  useCancelAutoRenewalMutation,
  useRenewAutoRenewalMutation,
} = paymentsApi
