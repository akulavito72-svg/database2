import { create } from 'zustand'
import { loginWithDummyJson } from '../api/dummyJson'
import type { LoginCredentials } from '../types/auth'
import type { ActionResult } from '../types/result'

type AuthState = {
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<ActionResult>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  login: async (credentials) => {
    try {
      await loginWithDummyJson(credentials)
      set({ isAuthenticated: true })
      return { success: true }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Ошибка авторизации. Попробуйте еще раз.'
      set({ isAuthenticated: false })
      return { success: false, error: errorMessage }
    }
  },
  logout: () => set({ isAuthenticated: false }),
}))
