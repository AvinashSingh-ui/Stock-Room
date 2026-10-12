import { useEffect } from 'react'
import { Form, Input, InputNumber, Modal, Select, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { closeEditor } from '../features/items/uiSlice'
import { useAddItemMutation, useUpdateItemMutation } from '../features/items/itemsApi'

const CATEGORIES = ['Furniture', 'Lighting', 'Accessories', 'Storage']

export default function ItemFormModal() {
  const dispatch = useDispatch()
  const { open, item } = useSelector((s) => s.ui.editor)
  const [form] = Form.useForm()
  const [addItem, { isLoading: adding }] = useAddItemMutation()
  const [updateItem, { isLoading: updating }] = useUpdateItemMutation()
  const isEdit = Boolean(item)

  // Reset the form each time the modal opens.
  useEffect(() => {
    if (!open) return
    form.resetFields()
    form.setFieldsValue(
      item ?? { category: 'Furniture', status: 'active', quantity: 0, price: 0 }
    )
  }, [open, item, form])

  const onOk = async () => {
    const values = await form.validateFields().catch(() => null)
    if (!values) return
    try {
      if (isEdit) {
        await updateItem({ id: item.id, ...values }).unwrap()
        message.success('Product saved')
      } else {
        await addItem(values).unwrap()
        message.success('Product added')
      }
      dispatch(closeEditor())
    } catch (err) {
      message.error(err?.data?.message ?? 'Something went wrong. Try again.')
    }
  }

  return (
    <Modal
      title={isEdit ? 'Edit product' : 'Add product'}
      open={open}
      onOk={onOk}
      onCancel={() => dispatch(closeEditor())}
      okText={isEdit ? 'Save changes' : 'Add product'}
      confirmLoading={adding || updating}
      destroyOnClose
    >
      <Form form={form} layout="vertical" requiredMark={false} style={{ marginTop: 16 }}>
        <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Enter a product name' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="sku"
          label="SKU"
          rules={[
            { required: true, message: 'Enter a SKU' },
            { pattern: /^[A-Za-z]{2,4}-\d{2,5}$/, message: 'Use a format like DSK-101' },
          ]}
        >
          <Input placeholder="DSK-101" />
        </Form.Item>
        <Form.Item name="category" label="Category">
          <Select options={CATEGORIES.map((c) => ({ value: c, label: c }))} />
        </Form.Item>
        <div style={{ display: 'flex', gap: 16 }}>
          <Form.Item name="price" label="Price" style={{ flex: 1 }} rules={[{ required: true, message: 'Enter a price' }]}>
            <InputNumber min={0} prefix="$" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="quantity" label="In stock" style={{ flex: 1 }} rules={[{ required: true, message: 'Enter a quantity' }]}>
            <InputNumber min={0} precision={0} style={{ width: '100%' }} />
          </Form.Item>
        </div>
        <Form.Item name="status" label="Status">
          <Select
            options={[
              { value: 'active', label: 'Active' },
              { value: 'archived', label: 'Archived' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
