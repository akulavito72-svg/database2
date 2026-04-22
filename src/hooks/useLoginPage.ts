import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import type { LoginCredentials } from '../types/auth'

export type LoginFormValues = LoginCredentials & {
  remember: boolean
}

interface UseLoginPageResult {
  error: string | null
  isSubmitting: boolean
  handleSubmit: (values: LoginFormValues) => Promise<void>
  clearError: () => void
}

export function useLoginPage(): UseLoginPageResult {
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const login = useAuthStore((state) => state.login)

  const clearError = () => {
    if (error) {
      setError(null)
    }
  }

  const handleSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true)

    const result = await login({ login: values.login, password: values.password })

    if (!result.success) {
      setError(
        result.error ??
          'Не удалось выполнить вход. Используйте валидные данные DummyJSON или логин "test" (демо-режим).',
      )
      setIsSubmitting(false)
      return
    }

    setError(null)
    setIsSubmitting(false)
  }

  return { error, isSubmitting, handleSubmit, clearError }
}
