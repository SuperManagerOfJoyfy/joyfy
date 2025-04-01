import { joyfyApi } from '@/shared/api/joyfyApi'

export const authApi = joyfyApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<any, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
    }),
    register: builder.mutation({
      query: (body) => ({
        url: '/auth/registration',
        method: 'POST',
        body,
      }),
    }),
    confirmEmail: builder.mutation({
      query: (body) => ({
        url: '/auth/registration-confirmation',
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    resendEmailConfirmation: builder.mutation({
      query: (body) => ({
        url: '/auth/registration-email-resending',
        method: 'POST',
        body,
      }),
    }),
    recoverPassword: builder.mutation({
      query: (body) => ({
        url: '/auth/password-recovery',
        method: 'POST',
        body,
      }),
    }),
    newPassword: builder.mutation({
      query: (body) => ({
        url: '/auth/new-password',
        method: 'POST',
        body,
      }),
    }),
    logoutAllSessions: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/devices',
        method: 'DELETE',
      }),
    }),
    clearAllData: builder.mutation({
      query: () => ({
        url: '/auth/all-data',
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useGetMeQuery,
  useRegisterMutation,
  useConfirmEmailMutation,
  useLoginMutation,
  useLogoutMutation,
  useResendEmailConfirmationMutation,
  useRecoverPasswordMutation,
  useNewPasswordMutation,
  useLogoutAllSessionsMutation,
  useClearAllDataMutation,
} = authApi
