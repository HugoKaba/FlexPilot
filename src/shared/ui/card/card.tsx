import type { HTMLAttributes, ReactNode } from 'react'

export const Card = ({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) => {
  return (
    <div className={`card ${className}`.trim()} {...props}>
      {children}
    </div>
  )
}
