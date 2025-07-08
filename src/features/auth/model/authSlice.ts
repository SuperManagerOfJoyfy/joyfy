import { RootState } from '@/app/store/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type AuthState = {
  token: string | null
}

const initialState: AuthState = {
  token: null,
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
  },
})

export const { setToken, clearToken } = authSlice.actions
export const authReducer = authSlice.reducer

export const selectToken = (state: RootState) => state.auth.token
export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.token)
