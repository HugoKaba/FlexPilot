import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'
import type { ReactNode } from 'react'
import type { AuthUser } from '@/entities/user'
import { auth } from '@/shared/api'
import { useAuthStore } from './auth-store'

const mapAuthUser = (value: { uid: string; email: string | null }): AuthUser => ({
  uid: value.uid,
  email: value.email,
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const setUser = useAuthStore((state) => state.setUser)
  const setLoading = useAuthStore((state) => state.setLoading)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? mapAuthUser(firebaseUser) : null)
      setLoading(false)
    })

    return unsubscribe
  }, [setLoading, setUser])

  return <>{children}</>
}
