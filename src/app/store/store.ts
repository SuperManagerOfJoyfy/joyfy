import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { joyfyApi } from '@/shared/api/joyfyApi'
import { useDispatch } from 'react-redux'
import { notificationsApi } from '@/features/notifications/api/notificationsApi'
import notificationsReducer from '@/features/notifications/store/notificationsSlice'

export const store = configureStore({
  reducer: {
    [joyfyApi.reducerPath]: joyfyApi.reducer,
    // [notificationsApi.reducerPath]: notificationsApi.reducer,
    notifications: notificationsReducer,
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(joyfyApi.middleware, notificationsApi.middleware),
})

setupListeners(store.dispatch)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export const useAppDispatch = () => useDispatch<AppDispatch>()
