import { Form, Input, InputNumber, Modal } from 'antd'
import { useEffect } from 'react'
import type { ProductInput } from '../types/product'

interface ProductFormProps {
  open: boolean
  title: string
  submitText: string
  initialValues?: ProductInput
  onCancel: () => void
  onSubmit: (values: ProductInput) => void
}

export function ProductForm({
  open,
  title,
  submitText,
  initialValues,
  onCancel,
  onSubmit,
}: ProductFormProps) {
  const [form] = Form.useForm<ProductInput>()

  useEffect(() => {
    if (!open) {
      return
    }

    if (initialValues) {
      form.setFieldsValue(initialValues)
      return
    }

    form.resetFields()
  }, [form, initialValues, open])

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  const handleOk = async () => {
    const values = await form.validateFields()
    onSubmit(values)
    form.resetFields()
  }

  return (
    <Modal
      title={title}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText={submitText}
      cancelText="Отмена"
      destroyOnClose
    >
      <Form<ProductInput>
        form={form}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          name="name"
          label="Наименование"
          rules={[{ required: true, message: 'Введите наименование' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="category"
          label="Категория"
          rules={[{ required: true, message: 'Введите категорию' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="vendor"
          label="Вендор"
          rules={[{ required: true, message: 'Введите вендора' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="article"
          label="Артикул"
          rules={[{ required: true, message: 'Введите артикул' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="rating"
          label="Оценка"
          rules={[
            { required: true, message: 'Введите оценку' },
            { type: 'number', min: 0, max: 5, message: 'Оценка должна быть от 0 до 5' },
          ]}
        >
          <InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="price"
          label="Цена"
          rules={[
            { required: true, message: 'Введите цену' },
            { type: 'number', min: 1, message: 'Цена должна быть больше 0' },
          ]}
        >
          <InputNumber min={1} step={100} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
