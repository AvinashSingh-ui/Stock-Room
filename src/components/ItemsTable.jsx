import { useMemo } from 'react'
import { Alert, Button, Empty, Popconfirm, Space, Table, Tag, message } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { useDeleteItemMutation } from '../features/items/itemsApi'
import { LOW_STOCK_LIMIT, openEditor } from '../features/items/uiSlice'

export default function ItemsTable({ items = [], loading, error, onRetry }) {
  const dispatch = useDispatch()
  const { search, status } = useSelector((s) => s.ui)
  const [deleteItem] = useDeleteItemMutation()

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((i) => {
      if (q && !`${i.name} ${i.sku} ${i.category}`.toLowerCase().includes(q)) return false
      if (status === 'active') return i.status === 'active'
      if (status === 'archived') return i.status === 'archived'
      if (status === 'low') return i.status === 'active' && i.quantity <= LOW_STOCK_LIMIT
      return true
    })
  }, [items, search, status])

  const onDelete = async (item) => {
    try {
      await deleteItem(item.id).unwrap()
      message.success(`Deleted ${item.name}`)
    } catch {
      message.error('Could not delete the product. It has been restored.')
    }
  }

  if (error) {
    return (
      <Alert
        type="error"
        showIcon
        message="Products didn't load"
        description="Check your connection and try again."
        action={<Button onClick={onRetry}>Retry</Button>}
      />
    )
  }

  const columns = [
    { title: 'Name', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'SKU', dataIndex: 'sku', width: 110 },
    { title: 'Category', dataIndex: 'category', width: 140 },
    {
      title: 'Price',
      dataIndex: 'price',
      align: 'right',
      width: 100,
      sorter: (a, b) => a.price - b.price,
      render: (v) => `$${v.toLocaleString()}`,
    },
    {
      title: 'In stock',
      dataIndex: 'quantity',
      align: 'right',
      width: 110,
      sorter: (a, b) => a.quantity - b.quantity,
      render: (v, r) =>
        r.status === 'active' && v <= LOW_STOCK_LIMIT ? (
          <Tag color="orange">{v} left</Tag>
        ) : (
          v
        ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 110,
      render: (v) => <Tag color={v === 'active' ? 'green' : 'default'}>{v === 'active' ? 'Active' : 'Archived'}</Tag>,
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: (_, item) => (
        <Space>
          <Button type="text" aria-label={`Edit ${item.name}`} icon={<EditOutlined />} onClick={() => dispatch(openEditor(item))} />
          <Popconfirm
            title="Delete this product?"
            description="This can't be undone."
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDelete(item)}
          >
            <Button type="text" danger aria-label={`Delete ${item.name}`} icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={rows}
      loading={loading}
      pagination={{ pageSize: 8, hideOnSinglePage: true }}
      scroll={{ x: 760 }}
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={items.length ? 'No products match these filters' : 'No products yet. Add your first one.'}
          />
        ),
      }}
    />
  )
}
