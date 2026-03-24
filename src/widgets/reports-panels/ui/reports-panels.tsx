import type { Sprint } from '@/entities/sprint'
import type { WorkItem } from '@/entities/work-item'
import { Card } from '@/shared/ui'

export const ReportsPanels = ({ items, sprints }: { items: WorkItem[]; sprints: Sprint[] }) => {
  const byStatus = {
    todo: items.filter((item) => item.status === 'todo').length,
    inProgress: items.filter((item) => item.status === 'in_progress').length,
    review: items.filter((item) => item.status === 'review').length,
    done: items.filter((item) => item.status === 'done').length,
  }

  const totalEstimate = items.reduce((sum, item) => sum + item.estimate, 0)
  const deliveredEstimate = items.filter((item) => item.status === 'done').reduce((sum, item) => sum + item.estimate, 0)
  const activeSprints = sprints.filter((sprint) => sprint.status === 'active').length

  return (
    <section className="grid-3">
      <Card className="metric-card">
        <h2>Flow Distribution</h2>
        <p>Todo: {byStatus.todo}</p>
        <p>In progress: {byStatus.inProgress}</p>
        <p>Review: {byStatus.review}</p>
        <p>Done: {byStatus.done}</p>
      </Card>

      <Card className="metric-card">
        <h2>Delivery Capacity</h2>
        <p>Total points: {totalEstimate}</p>
        <p>Delivered points: {deliveredEstimate}</p>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${totalEstimate ? Math.round((deliveredEstimate / totalEstimate) * 100) : 0}%` }} />
        </div>
      </Card>

      <Card className="metric-card">
        <h2>Sprint Health</h2>
        <p>Sprints actifs: {activeSprints}</p>
        <p>Total sprints: {sprints.length}</p>
      </Card>
    </section>
  )
}
