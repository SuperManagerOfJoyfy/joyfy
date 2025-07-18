import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { joyfyApi } from '@/shared/api/joyfyApi'
import { useDispatch } from 'react-redux'
import { authReducer } from '@/features/auth/model/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [joyfyApi.reducerPath]: joyfyApi.reducer,
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(joyfyApi.middleware),
})

setupListeners(store.dispatch)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export const useAppDispatch = () => useDispatch<AppDispatch>()
