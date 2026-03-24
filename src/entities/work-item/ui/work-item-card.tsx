import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { WorkItem } from '@/entities/work-item/model/work-item-schemas'
import { Badge, Card } from '@/shared/ui'

export const WorkItemCard = ({ item, actions }: { item: WorkItem; actions?: ReactNode }) => {
  return (
    <Card className="work-item-card">
      <div className="work-item-head">
        <h3 className="card-title">
          <Link to={`/work-items/${item.id}`}>{item.title}</Link>
        </h3>
        <Badge>{item.type}</Badge>
      </div>
      <p className="work-item-description">{item.description}</p>
      <div className="work-item-meta">
        <Badge>P{item.priority}</Badge>
        <Badge>{item.status}</Badge>
        <Badge>{item.assignee}</Badge>
        <Badge>{item.estimate} pts</Badge>
      </div>
      {actions}
    </Card>
  )
}
