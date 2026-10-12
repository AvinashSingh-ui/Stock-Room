import { createSlice } from '@reduxjs/toolkit'
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    search: '',
    status: 'all',
    editor: { open: false, item: null }, 
  },
  reducers: {
    setSearch: (state, { payload }) => {
      state.search = payload
    },
    setStatus: (state, { payload }) => {
      state.status = payload
    },
    openEditor: (state, { payload = null }) => {
      state.editor = { open: true, item: payload }
    },
    closeEditor: (state) => {
      state.editor = { open: false, item: null }
    },
  },
})

export const { setSearch, setStatus, openEditor, closeEditor } = uiSlice.actions
export default uiSlice.reducer

export const LOW_STOCK_LIMIT = 10
