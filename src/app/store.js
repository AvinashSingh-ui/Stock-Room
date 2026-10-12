import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { itemsApi } from '../features/items/itemsApi'
import uiReducer from '../features/items/uiSlice'

export const store = configureStore({
  reducer: {
    [itemsApi.reducerPath]: itemsApi.reducer,
    ui: uiReducer,
  },
  middleware: (getDefault) => getDefault().concat(itemsApi.middleware),
})

setupListeners(store.dispatch)
