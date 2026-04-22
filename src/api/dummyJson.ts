import type { LoginCredentials } from '../types/auth'
import type { Product } from '../types/product'

const DUMMY_JSON_BASE_URL = 'https://dummyjson.com'

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

type DummyJsonError = {
  message?: string
}

type DummyProduct = {
  id: number
  title: string
  category: string
  brand?: string
  sku?: string
  rating: number
  price: number
}

type DummyProductsResponse = {
  products: DummyProduct[]
}

type DummyAuthResponse = {
  accessToken?: string
  token?: string
}

const mapDummyProduct = (item: DummyProduct): Product => ({
  id: item.id,
  name: item.title,
  category: item.category,
  vendor: item.brand ?? 'Unknown',
  article: item.sku ?? `ART-${item.id}`,
  rating: item.rating,
  price: item.price,
})

async function requestJson<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${DUMMY_JSON_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const data = (await response.json()) as T | DummyJsonError

  if (!response.ok) {
    const errorData = data as DummyJsonError
    throw new Error(errorData.message ?? 'Запрос к DummyJSON завершился ошибкой.')
  }

  return data as T
}

export async function fetchProductsFromDummyJson(): Promise<Product[]> {
  const data = await requestJson<DummyProductsResponse>('/products?limit=100')
  return data.products.map(mapDummyProduct)
}

export async function loginWithDummyJson(credentials: LoginCredentials): Promise<void> {
  const username = credentials.login.trim()
  const password = credentials.password.trim()

  const requestPayload =
    username.toLowerCase() === 'test'
      ? {
          username: 'emilys',
          password: 'emilyspass',
          expiresInMins: 30,
        }
      : {
          username,
          password,
          expiresInMins: 30,
        }

  const data = await requestJson<DummyAuthResponse>('/auth/login', {
    method: 'POST',
    body: requestPayload,
  })

  const hasToken = Boolean(data.accessToken ?? data.token)

  if (!hasToken) {
    throw new Error('Не удалось выполнить авторизацию в DummyJSON.')
  }
}
