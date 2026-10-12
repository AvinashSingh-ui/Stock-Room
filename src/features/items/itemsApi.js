import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { db } from './mockDb'

const run = async (fn) => {
  try {
    return { data: await fn() }
  } catch (error) {
    return { error }
  }
}

export const itemsApi = createApi({
  reducerPath: 'itemsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Item'],
  endpoints: (build) => ({
    getItems: build.query({
      queryFn: () => run(() => db.list()),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Item', id })), { type: 'Item', id: 'LIST' }]
          : [{ type: 'Item', id: 'LIST' }],
    }),

    addItem: build.mutation({
      queryFn: (body) => run(() => db.create(body)),
      invalidatesTags: [{ type: 'Item', id: 'LIST' }],
    }),

    updateItem: build.mutation({
      queryFn: ({ id, ...patch }) => run(() => db.update(id, patch)),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'Item', id }],
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const undo = dispatch(
          itemsApi.util.updateQueryData('getItems', undefined, (draft) => {
            const item = draft.find((i) => i.id === id)
            if (item) Object.assign(item, patch)
          })
        )
        try {
          await queryFulfilled
        } catch {
          undo.undo()
        }
      },
    }),

    deleteItem: build.mutation({
      queryFn: (id) => run(() => db.remove(id)),
      invalidatesTags: (_res, _err, id) => [{ type: 'Item', id }, { type: 'Item', id: 'LIST' }],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const undo = dispatch(
          itemsApi.util.updateQueryData('getItems', undefined, (draft) => {
            const idx = draft.findIndex((i) => i.id === id)
            if (idx !== -1) draft.splice(idx, 1)
          })
        )
        try {
          await queryFulfilled
        } catch {
          undo.undo()
        }
      },
    }),
  }),
})

export const {
  useGetItemsQuery,
  useAddItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} = itemsApi
