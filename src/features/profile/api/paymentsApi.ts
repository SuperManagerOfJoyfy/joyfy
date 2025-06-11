import { joyfyApi } from '@/shared/api/joyfyApi'
import { PaymentRecord } from './paymentsApi.types'

export const paymentsApi = joyfyApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyPayments: builder.query<PaymentRecord[], void>({
      query: () => ({
        url: '/subscriptions/my-payments',
      }),
      providesTags: ['Payments'],
    }),
  }),
  overrideExisting: true,
})

export const { useGetMyPaymentsQuery } = paymentsApi
