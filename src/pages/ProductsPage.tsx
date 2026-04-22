import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Card, Input, Typography } from 'antd'
import { ProductForm } from '../components/ProductForm'
import { ProductTable } from '../components/ProductTable'
import { useProductsPage } from '../hooks/useProductsPage'
import { useAuthStore } from '../store/authStore'
import './ProductsPage.css'

export function ProductsPage() {
  const logout = useAuthStore((state) => state.logout)
  const {
    searchValue,
    isFormOpen,
    editingProduct,
    filteredProducts,
    isLoading,
    formInitialValues,
    setSearchValue,
    openCreateForm,
    openEditForm,
    closeForm,
    handleDelete,
    handleSubmit,
    handleRefresh,
  } = useProductsPage()

  return (
    <section className="tech-grid">
      <Button className="tech-exit" onClick={logout}>
        Выйти
      </Button>

      <Card className="tech-top" bordered={false}>
        <Typography.Title level={1} className="tech-title">
          Товары
        </Typography.Title>
        <Input
          className="tech-find"
          placeholder="Найти"
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          allowClear
        />
      </Card>

      <Card className="tech-list" bordered={false}>
        <header className="list-head">
          <Typography.Title level={2} className="list-title">
            Все позиции
          </Typography.Title>

          <div className="head-tools">
            <Button className="btn-sync" icon={<ReloadOutlined />} onClick={handleRefresh} loading={isLoading} />
            <Button className="btn-add" type="primary" icon={<PlusOutlined />} onClick={openCreateForm}>
              Добавить
            </Button>
          </div>
        </header>

        <ProductTable products={filteredProducts} loading={isLoading} onEdit={openEditForm} onDelete={handleDelete} />
      </Card>

      <ProductForm
        open={isFormOpen}
        title={editingProduct ? 'Редактирование товара' : 'Добавление товара'}
        submitText={editingProduct ? 'Сохранить' : 'Создать'}
        initialValues={formInitialValues}
        onCancel={closeForm}
        onSubmit={handleSubmit}
      />
    </section>
  )
}
