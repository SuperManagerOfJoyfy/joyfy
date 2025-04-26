import { joyfyApi } from '@/shared/api/joyfyApi'
import {
  MeResponse,
  LoginRequest,
  RegisterRequest,
  ConfirmEmailRequest,
  EmailInputDto,
  RecoverPasswordRequest,
  NewPasswordRequest,
  RefreshTokenResponse,
  LoginResponse,
} from './authApi.types'

export const authApi = joyfyApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<MeResponse, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      transformResponse: (response: MeResponse) => {
        console.log('🔍 getMe raw response:', response)
        return response
      },
      providesTags: ['User'],
    }),

    register: builder.mutation<void, RegisterRequest>({
      query: (body) => ({
        url: '/auth/registration',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    

    confirmEmail: builder.mutation<void, ConfirmEmailRequest>({
      query: (body) => ({
        url: '/auth/registration-confirmation',
        method: 'POST',
        body,
      }),
    }),

    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User', 'Auth'],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    resendEmailConfirmation: builder.mutation<void, EmailInputDto>({
      query: (body) => ({
        url: '/auth/registration-email-resending',
        method: 'POST',
        body,
      }),
    }),

    recoverPassword: builder.mutation<void, RecoverPasswordRequest>({
      query: (body) => ({
        url: '/auth/password-recovery',
        method: 'POST',
        body,
      }),
    }),

    newPassword: builder.mutation<void, NewPasswordRequest>({
      query: (body) => ({
        url: '/auth/new-password',
        method: 'POST',
        body,
      }),
    }),

    refreshToken: builder.mutation<RefreshTokenResponse, void>({
      query: () => ({
        url: '/auth/update-tokens',
        method: 'POST',
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
  useRefreshTokenMutation,
  useLazyGetMeQuery,
} = authApi
