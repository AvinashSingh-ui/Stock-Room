
const KEY = 'stockroom-items-v1'

const seed = [
  { id: 1, name: 'Walnut desk shelf', sku: 'DSK-101', category: 'Furniture', price: 84, quantity: 23, status: 'active' },
  { id: 2, name: 'Brass desk lamp', sku: 'LMP-204', category: 'Lighting', price: 129, quantity: 4, status: 'active' },
  { id: 3, name: 'Felt cable organizer', sku: 'ACC-330', category: 'Accessories', price: 18, quantity: 112, status: 'active' },
  { id: 4, name: 'Oak monitor riser', sku: 'DSK-118', category: 'Furniture', price: 62, quantity: 0, status: 'archived' },
  { id: 5, name: 'Ceramic pen cup', sku: 'ACC-341', category: 'Accessories', price: 14, quantity: 7, status: 'active' },
  { id: 6, name: 'Task chair, mesh', sku: 'CHR-007', category: 'Furniture', price: 289, quantity: 12, status: 'active' },
]

const read = () => {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* fall through to seed */ }
  return seed
}

const write = (items) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(items))
  } catch { /* storage unavailable; changes last for this session only */ }
}

let items = read()
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

export const db = {
  async list() {
    await delay()
    return [...items]
  },
  async create(data) {
    await delay()
    if (items.some((i) => i.sku.toLowerCase() === data.sku.toLowerCase())) {
      throw { status: 409, data: { message: `SKU ${data.sku} already exists.` } }
    }
    const item = { ...data, id: Date.now() }
    items = [item, ...items]
    write(items)
    return item
  },
  async update(id, patch) {
    await delay()
    const clash = items.some(
      (i) => i.id !== id && patch.sku && i.sku.toLowerCase() === patch.sku.toLowerCase()
    )
    if (clash) throw { status: 409, data: { message: `SKU ${patch.sku} already exists.` } }
    items = items.map((i) => (i.id === id ? { ...i, ...patch } : i))
    write(items)
    return items.find((i) => i.id === id)
  },
  async remove(id) {
    await delay()
    items = items.filter((i) => i.id !== id)
    write(items)
    return { id }
  },
}
