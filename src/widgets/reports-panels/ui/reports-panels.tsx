import type { Sprint } from '@/entities/sprint'
import type { WorkItem } from '@/entities/work-item'
import { useI18n } from '@/shared/lib'
import { Card } from '@/shared/ui'

export const ReportsPanels = ({ items, sprints }: { items: WorkItem[]; sprints: Sprint[] }) => {
  const { t } = useI18n()
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
        <h2>{t('flowDistribution')}</h2>
        <p>Todo: {byStatus.todo}</p>
        <p>{t('inProgress')}: {byStatus.inProgress}</p>
        <p>Review: {byStatus.review}</p>
        <p>Done: {byStatus.done}</p>
      </Card>

      <Card className="metric-card">
        <h2>{t('deliveryCapacity')}</h2>
        <p>{t('totalPoints')}: {totalEstimate}</p>
        <p>{t('deliveredPoints')}: {deliveredEstimate}</p>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${totalEstimate ? Math.round((deliveredEstimate / totalEstimate) * 100) : 0}%` }} />
        </div>
      </Card>

      <Card className="metric-card">
        <h2>{t('sprintHealth')}</h2>
        <p>{t('activeSprints')}: {activeSprints}</p>
        <p>{t('totalSprints')}: {sprints.length}</p>
      </Card>
    </section>
  )
}
