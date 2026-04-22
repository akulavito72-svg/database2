import { Button, Checkbox, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { Product } from '../types/product'
import { useTablePagination } from '../hooks/useTablePagination'
import './ProductTable.css'

interface ProductTableProps {
  products: Product[]
  loading?: boolean
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
}

const PAGE_SIZE = 10

const formatPrice = (price: number): string =>
  new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(price)
    .replace(/\u00A0/g, ' ')

const getCols = (
  onEdit?: (product: Product) => void,
  onDelete?: (product: Product) => void,
): ColumnsType<Product> => [
  {
    title: '',
    dataIndex: 'id',
    key: 'sel',
    width: 56,
    render: () => <Checkbox />,
  },
  {
    title: 'Наименование',
    dataIndex: 'name',
    key: 'name',
    sorter: (a: Product, b: Product) => a.name.localeCompare(b.name, 'ru'),
    sortDirections: ['ascend', 'descend'],
    render: (_: string, product: Product) => (
      <div className="dev-main">
        <div className="dev-pic" />
        <div className="dev-text">
          <Typography.Text className="dev-name">{product.name}</Typography.Text>
          <Typography.Text className="dev-type">{product.category}</Typography.Text>
        </div>
      </div>
    ),
  },
  {
    title: 'Вендор',
    dataIndex: 'vendor',
    key: 'vendor',
    render: (vendor: string) => <Typography.Text className="dev-brand">{vendor}</Typography.Text>,
  },
  {
    title: 'Артикул',
    dataIndex: 'article',
    key: 'article',
  },
  {
    title: 'Оценка',
    dataIndex: 'rating',
    key: 'rating',
    width: 120,
    render: (rating: number) => (
      <Typography.Text className={rating < 4 ? 'rate-low' : undefined}>{rating.toFixed(1)}/5</Typography.Text>
    ),
  },
  {
    title: 'Цена, ₽',
    dataIndex: 'price',
    key: 'price',
    width: 190,
    sorter: (a: Product, b: Product) => a.price - b.price,
    sortDirections: ['ascend', 'descend'],
    render: (price: number) => formatPrice(price),
  },
  {
    title: '',
    key: 'act',
    width: 220,
    render: (_: unknown, product: Product) => (
      <div className="dev-act">
        <Button size="small" onClick={() => onEdit?.(product)}>
          Редактировать
        </Button>
        <Button size="small" danger onClick={() => onDelete?.(product)}>
          Удалить
        </Button>
      </div>
    ),
  },
]

export function ProductTable({ products, loading = false, onEdit, onDelete }: ProductTableProps) {
  const { currentPage, pagination } = useTablePagination({
    total: products.length,
    pageSize: PAGE_SIZE,
    showTotal: (total: number, range: [number, number]) => `Показано ${range[0]}-${range[1]} из ${total}`,
  })

  return (
    <Table<Product>
      className="dev-table"
      rowKey="id"
      dataSource={products}
      loading={loading}
      columns={getCols(onEdit, onDelete)}
      pagination={{
        ...pagination,
        current: currentPage,
      }}
      size="middle"
    />
  )
}
