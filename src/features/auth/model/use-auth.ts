import { login, logout, register } from './auth-actions'
import { useAuthStore } from './auth-store'

export const useAuth = () => {
  const user = useAuthStore((state) => state.user)
  const loading = useAuthStore((state) => state.loading)

  return { user, loading, login, register, logout }
}
