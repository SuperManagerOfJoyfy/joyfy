import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type AuthState = {
	userId: string | null
	userName: string | null
	email: string | null
	isAuthenticated: boolean
}

const initialState: AuthState = {
	userId: null,
	userName: null,
	email: null,
	isAuthenticated: false,
}

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setUserData: (state, action: PayloadAction<{ userId: string; userName: string; email: string }>) => {
			state.userId = action.payload.userId
			state.userName = action.payload.userName
			state.email = action.payload.email
			state.isAuthenticated = true
		},
		clearUserData: (state) => {
			Object.assign(state, initialState)
		},
	},
	selectors: {
		selectUserName: (state) => state.userName
	}
})

export const { setUserData, clearUserData } = authSlice.actions
export const { selectUserName } = authSlice.selectors
export const authReducer = authSlice.reducer