import { joyfyApi } from '@/shared/api/joyfyApi'
import {
  ConfirmEmailRequest,
  EmailInputDto,
  GoogleLoginRequest,
  LoginRequest,
  LoginResponse,
  MeResponse,
  NewPasswordRequest,
  RecoverPasswordRequest,
  RefreshTokenResponse,
  RegisterRequest,
} from './authApi.types'
import LocalStorage from '@/shared/utils/localStorage/localStorage'

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
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled

          if (!data) {
            return
          }

          LocalStorage.setToken(data.accessToken)
        } catch (error) {
          console.error('Login failed:', error)
        }
      },
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

    googleLogin: builder.mutation<LoginResponse, GoogleLoginRequest>({
      query: (body) => ({
        url: '/auth/google/login',
        method: 'POST',
        body: {
          code: body.code,
          redirectUrl: body.redirectUrl,
        },
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
  useGoogleLoginMutation,
} = authApi
