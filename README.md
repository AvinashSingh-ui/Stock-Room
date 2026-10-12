# Stockroom: CRUD dashboard

React + Redux Toolkit + RTK Query + Ant Design.

```bash
npm install
npm run dev
```

## Structure

- `src/app/store.js`: store, RTK Query middleware, `setupListeners`
- `src/features/items/itemsApi.js`: RTK Query endpoints (list, add, update, delete) with tag invalidation and optimistic updates
- `src/features/items/uiSlice.js`: client-only UI state (search, filter, editor modal)
- `src/features/items/mockDb.js`: fake backend persisted in localStorage
- `src/components/*`: stats, table, add/edit modal

## Connecting a real API

In `itemsApi.js`, swap `fakeBaseQuery()` for `fetchBaseQuery({ baseUrl: '/api' })` and replace each `queryFn`:

```js
getItems:   build.query({ query: () => '/items' }),
addItem:    build.mutation({ query: (body) => ({ url: '/items', method: 'POST', body }) }),
updateItem: build.mutation({ query: ({ id, ...body }) => ({ url: `/items/${id}`, method: 'PATCH', body }) }),
deleteItem: build.mutation({ query: (id) => ({ url: `/items/${id}`, method: 'DELETE' }) }),
```

The tags, optimistic updates and UI stay the same. Delete `mockDb.js`.
