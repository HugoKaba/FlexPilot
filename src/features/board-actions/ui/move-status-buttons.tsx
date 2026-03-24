import { type WorkItemStatus } from '@/entities/work-item'
import { Button } from '@/shared/ui'

const transitions: Record<WorkItemStatus, WorkItemStatus[]> = {
  todo: ['in_progress'],
  in_progress: ['review', 'todo'],
  review: ['done', 'in_progress'],
  done: ['review'],
}

export const MoveStatusButtons = ({
  current,
  onMove,
}: {
  current: WorkItemStatus
  onMove: (status: WorkItemStatus) => void
}) => {
  const labels: Record<WorkItemStatus, string> = {
    todo: 'Todo',
    in_progress: 'In Progress',
    review: 'Review',
    done: 'Done',
  }

  return (
    <div className="status-pill-actions">
      {transitions[current].map((target) => (
        <Button key={target} type="button" tone="muted" className="status-pill-btn" onClick={() => onMove(target)}>
          {labels[target]}
        </Button>
      ))}
    </div>
  )
}
