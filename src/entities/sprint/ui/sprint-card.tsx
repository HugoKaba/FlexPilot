import type { ReactNode } from 'react'
import type { Sprint } from '@/entities/sprint/model/sprint-schemas'
import { Badge, Card } from '@/shared/ui'

export const SprintCard = ({ sprint, actions }: { sprint: Sprint; actions?: ReactNode }) => {
  return (
    <Card className="sprint-card">
      <div className="sprint-head">
        <h3 className="card-title">{sprint.name}</h3>
        <Badge>{sprint.status}</Badge>
      </div>
      <p>{sprint.goal}</p>
      <p className="sprint-dates">
        {`${sprint.startDate} -> ${sprint.endDate}`}
      </p>
      {actions}
    </Card>
  )
}
