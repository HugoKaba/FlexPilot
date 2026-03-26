import type { WorkItem } from '@/entities/work-item'
import { useI18n } from '@/shared/lib'
import { Card } from '@/shared/ui'

export const TeamWorkload = ({ items }: { items: WorkItem[] }) => {
  const { t } = useI18n()
  const workload = items.reduce<Record<string, { total: number; done: number }>>((acc, item) => {
    if (!acc[item.assignee]) {
      acc[item.assignee] = { total: 0, done: 0 }
    }

    acc[item.assignee].total += 1
    if (item.status === 'done') {
      acc[item.assignee].done += 1
    }

    return acc
  }, {})

  const members = Object.entries(workload)

  if (!members.length) {
    return <Card>{t('noAssigneeYet')}</Card>
  }

  return (
    <section className="page">
      {members.map(([assignee, stats]) => (
        <Card key={assignee} className="metric-card">
          <h2>{assignee}</h2>
          <p>{stats.done}/{stats.total} {t('itemsDone')}</p>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${Math.round((stats.done / stats.total) * 100)}%` }} />
          </div>
        </Card>
      ))}
    </section>
  )
}
