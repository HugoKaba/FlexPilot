import type { ReactNode } from 'react'

export const Badge = ({ children }: { children: ReactNode }) => {
  return <span className="badge">{children}</span>
}
