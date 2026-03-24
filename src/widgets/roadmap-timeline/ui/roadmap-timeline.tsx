import type { Sprint } from '@/entities/sprint'
import type { WorkItem } from '@/entities/work-item'
import { Card } from '@/shared/ui'

export const RoadmapTimeline = ({ sprints, items }: { sprints: Sprint[]; items: WorkItem[] }) => {
  if (!sprints.length) {
    return <Card>Aucun sprint disponible pour la roadmap.</Card>
  }

  return (
    <section className="page">
      {sprints.map((sprint) => {
        const sprintItems = items.filter((item) => item.sprintId === sprint.id)
        const done = sprintItems.filter((item) => item.status === 'done').length

        return (
          <Card key={sprint.id} className="timeline-card">
            <div className="timeline-head">
              <h2>{sprint.name}</h2>
              <span className="badge">{sprint.status}</span>
            </div>
            <p>{sprint.goal}</p>
            <p className="page-subtitle">{`${sprint.startDate} -> ${sprint.endDate}`}</p>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${sprintItems.length ? Math.round((done / sprintItems.length) * 100) : 0}%` }}
              />
            </div>
            <p className="page-subtitle">
              Avancement: {done}/{sprintItems.length} items
            </p>
          </Card>
        )
      })}
    </section>
  )
}
