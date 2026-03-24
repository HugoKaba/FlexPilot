import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: 'primary' | 'muted' | 'danger'
  children: ReactNode
}

export const Button = ({ tone = 'muted', className = '', children, ...props }: ButtonProps) => {
  return (
    <button className={`btn btn-${tone} ${className}`.trim()} {...props}>
      {children}
    </button>
  )
}
