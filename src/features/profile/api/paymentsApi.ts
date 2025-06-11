import { joyfyApi } from '@/shared/api/joyfyApi'
import { CreatePaymentRequest, PaymentRecord } from './paymentsApi.types'

export const paymentsApi = joyfyApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyPayments: builder.query<PaymentRecord[], void>({
      query: () => ({
        url: '/subscriptions/my-payments',
      }),
      providesTags: ['Payments'],
    }),
    createPayment: builder.mutation<{ url: string }, CreatePaymentRequest>({
      query: (body) => ({
        body,
        url: '/subscriptions',
        method: 'POST',
      }),
    }),
  }),
  overrideExisting: true,
})

export const { useGetMyPaymentsQuery, useCreatePaymentMutation } = paymentsApi
