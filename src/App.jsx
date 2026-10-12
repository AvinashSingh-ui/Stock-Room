import { Button, Card, Input, Layout, Segmented, Space, Typography } from 'antd'
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { useGetItemsQuery } from './features/items/itemsApi'
import { openEditor, setSearch, setStatus } from './features/items/uiSlice'
import StatsRow from './components/StatsRow'
import ItemsTable from './components/ItemsTable'
import ItemFormModal from './components/ItemFormModal'

const { Header, Content } = Layout

export default function App() {
  const dispatch = useDispatch()
  const { search, status } = useSelector((s) => s.ui)
  const { data: items, isLoading, isFetching, isError, refetch } = useGetItemsQuery()

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f6f6' }}>
      <Header style={{ background: '#fff', borderBottom: '1px solid #e5e7e7', display: 'flex', alignItems: 'center', padding: '0 24px' }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          Stockroom
        </Typography.Title>
      </Header>

      <Content style={{ padding: 24, maxWidth: 1100, width: '100%', margin: '0 auto' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <StatsRow items={items} loading={isLoading} />

          <Card
            title="Products"
            extra={
              <Space>
                <Button icon={<ReloadOutlined />} onClick={refetch} loading={isFetching && !isLoading}>
                  Refresh
                </Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => dispatch(openEditor())}>
                  Add product
                </Button>
              </Space>
            }
          >
            <Space wrap style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
              <Input
                allowClear
                prefix={<SearchOutlined />}
                placeholder="Search name, SKU or category"
                value={search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
                style={{ width: 280 }}
              />
              <Segmented
                value={status}
                onChange={(v) => dispatch(setStatus(v))}
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'active', label: 'Active' },
                  { value: 'low', label: 'Low stock' },
                  { value: 'archived', label: 'Archived' },
                ]}
              />
            </Space>

            <ItemsTable items={items} loading={isLoading} error={isError} onRetry={refetch} />
          </Card>
        </Space>
      </Content>

      <ItemFormModal />
    </Layout>
  )
}
