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
      // This is the handler that gets triggered when the login mutation is started.
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          // Wait for the login query to complete and get the response data
          const { data } = await queryFulfilled

          if (!data) return

          LocalStorage.setToken(data.accessToken)

          // Invalidate any cached data related to the 'User' tag to trigger a refetch
          dispatch(authApi.util.invalidateTags(['User']))

          // Dispatch the `getMe` endpoint to fetch user information after login
          dispatch(authApi.endpoints.getMe.initiate())
        } catch (error) {
          console.error('Login failed:', error)
        }
      },
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled

          LocalStorage.removeToken()
          // localStorage.removeItem('lightBackground')
          // localStorage.removeItem('textColor')

          dispatch(authApi.util.resetApiState())
        } catch (error) {
          console.error('Logout failed:', error)
        }
      },
      invalidatesTags: ['User', 'Auth'],
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
