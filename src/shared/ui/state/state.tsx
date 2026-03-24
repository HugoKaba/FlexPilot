import type { ReactNode } from 'react'
import { Card } from '@/shared/ui/card/card'

export const LoadingState = ({ text }: { text: string }) => <p className="status">{text}</p>

export const EmptyState = ({ title, action }: { title: string; action?: ReactNode }) => (
  <Card className="state-block">
    <p>{title}</p>
    {action}
  </Card>
)

export const ErrorState = ({ title, details }: { title: string; details?: ReactNode }) => (
  <Card className="state-block state-error">
    <p>{title}</p>
    {details}
  </Card>
)
