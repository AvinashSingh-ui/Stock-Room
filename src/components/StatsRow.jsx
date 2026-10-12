import { Card, Col, Row, Statistic } from 'antd'
import { LOW_STOCK_LIMIT } from '../features/items/uiSlice'

export default function StatsRow({ items = [], loading }) {
  const active = items.filter((i) => i.status === 'active')
  const low = active.filter((i) => i.quantity <= LOW_STOCK_LIMIT)
  const value = active.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={8}>
        <Card loading={loading}>
          <Statistic title="Active products" value={active.length} />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card loading={loading}>
          <Statistic
            title={`Low stock (${LOW_STOCK_LIMIT} or fewer)`}
            value={low.length}
            valueStyle={low.length ? { color: '#c2410c' } : undefined}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card loading={loading}>
          <Statistic title="Stock value" value={value} prefix="$" precision={0} />
        </Card>
      </Col>
    </Row>
  )
}
