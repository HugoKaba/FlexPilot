import { Link } from 'react-router-dom'
import type { WorkItem } from '@/entities/work-item'
import { usePreferencesStore } from '@/shared/model'

export const DashboardOverview = ({ projects }: { projects: WorkItem[] }) => {
  const density = usePreferencesStore((state) => (state.density === 'compact' ? 'Compact' : 'Comfort'))

  const total = projects.length
  const done = projects.filter((project) => project.status === 'done').length
  const inProgress = projects.filter((project) => project.status === 'in_progress').length

  return (
    <section className="page">
      <div className="grid-3">
        <article className="card metric-card">
          <h2>Total Items</h2>
          <p className="metric-value">{total}</p>
        </article>

        <article className="card metric-card">
          <h2>Done</h2>
          <p className="metric-value">{done}</p>
        </article>

        <article className="card metric-card">
          <h2>In progress</h2>
          <p className="metric-value">{inProgress}</p>
        </article>

        <article className="card metric-card">
          <h2>Densité UI</h2>
          <p className="metric-value">{density}</p>
        </article>
      </div>

      <div className="actions">
        <Link className="btn btn-primary" to="/backlog">
          Gérer backlog
        </Link>
        <Link className="btn btn-muted" to="/board">
          Ouvrir board
        </Link>
      </div>
    </section>
  )
}
