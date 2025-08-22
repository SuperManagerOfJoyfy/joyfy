import { RootState } from '@/app/store/store'
import { MeResponse } from '@/features/auth/api/authApi.types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type AuthState = {
  token: string | null

  currentUser: MeResponse | null
}

const initialState: AuthState = {
  token: null,

  currentUser: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    clearToken: (state) => {
      state.token = null
    },
    setCurrentUser: (state, action: PayloadAction<MeResponse>) => {
      state.currentUser = action.payload
    },
  },
})

export const { setToken, clearToken, setCurrentUser } = authSlice.actions
export const authReducer = authSlice.reducer

export const selectToken = (state: RootState) => state.auth.token
export const selectCurrentUser = (state: RootState) => state.auth.currentUser
export const selectCurrentUserId = (state: RootState) => state.auth.currentUser?.userId
