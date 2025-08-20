import { UserItem } from '@/features/userSearch/api/usersApi.types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface RecentRequestsState {
  users: UserItem[]
}

const initialState: RecentRequestsState = {
  users: [],
}

export const recentRequestsSlice = createSlice({
  name: 'recentRequests',
  initialState,
  reducers: {
    addRequest: (state, action: PayloadAction<UserItem>) => {
      const exists = state.users.some((r) => r.id === action.payload.id)
      if (!exists) {
        state.users.unshift(action.payload)
      }
    },
    clearRequests: (state) => {
      state.users = []
    },
  },
})

export const { addRequest, clearRequests } = recentRequestsSlice.actions
export const recentRequestsReducer = recentRequestsSlice.reducer
