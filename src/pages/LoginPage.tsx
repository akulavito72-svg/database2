import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Checkbox, Form, Input, Typography } from 'antd'
import { useLoginPage } from '../hooks/useLoginPage'
import type { LoginFormValues } from '../hooks/useLoginPage'
import './LoginPage.css'

export function LoginPage() {
  const { error, isSubmitting, handleSubmit, clearError } = useLoginPage()

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <div className="auth-logo">
          <img src="/frame-1.png" alt="Логотип" className="logo-img" />
        </div>

        <Typography.Title level={1} className="auth-title">
          Добро пожаловать!
        </Typography.Title>
        <Typography.Text className="auth-sub">Пожалуйста, авторизируйтесь</Typography.Text>
        <Typography.Text className="auth-tip">Демо-вход: test (или emilys / emilyspass)</Typography.Text>

        <Form<LoginFormValues>
          layout="vertical"
          initialValues={{ remember: false }}
          onFinish={handleSubmit}
          onValuesChange={clearError}
          className="auth-form"
          autoComplete="off"
        >
          <Form.Item label="Логин" name="login" rules={[{ required: true, message: 'Введите логин' }]}>
            <Input prefix={<UserOutlined />} placeholder="Введите логин" />
          </Form.Item>

          <Form.Item label="Пароль" name="password" rules={[{ required: true, message: 'Введите пароль' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Введите пароль" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked" className="auth-save">
            <Checkbox>Запомнить данные</Checkbox>
          </Form.Item>

          {error ? (
            <Form.Item className="auth-error">
              <Alert type="error" showIcon message={error} />
            </Form.Item>
          ) : null}

          <Button type="primary" htmlType="submit" block className="auth-enter" loading={isSubmitting}>
            Войти
          </Button>
        </Form>

        <div className="auth-or">или</div>

        <Typography.Paragraph className="auth-sign">
          Нет аккаунта?{' '}
          <Typography.Link href="#" onClick={(event) => event.preventDefault()}>
            Создать
          </Typography.Link>
        </Typography.Paragraph>
      </Card>
    </div>
  )
}
