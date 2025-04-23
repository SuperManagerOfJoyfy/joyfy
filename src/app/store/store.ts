import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { joyfyApi } from '@/shared/api/joyfyApi'

export const store = configureStore({
  reducer: {
    [joyfyApi.reducerPath]: joyfyApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(joyfyApi.middleware),
})

setupListeners(store.dispatch)
