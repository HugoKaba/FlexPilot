import { Link } from 'react-router-dom'
import type { Sprint } from '@/entities/sprint'
import { SprintCard } from '@/entities/sprint'
import { useI18n } from '@/shared/lib'
import { Button, EmptyState } from '@/shared/ui'

export const SprintsList = ({
  sprints,
  onDelete,
}: {
  sprints: Sprint[]
  onDelete: (sprintId: string) => void
}) => {
  const { t } = useI18n()

  if (!sprints.length) {
    return <EmptyState title={t('noSprintYet')} />
  }

  return (
    <section className="page">
      {sprints.map((sprint) => (
        <SprintCard
          key={sprint.id}
          sprint={sprint}
          actions={
            <div className="actions">
              <Link to={`/sprints/${sprint.id}`} className="btn btn-muted">
                {t('open')}
              </Link>
              <Button tone="danger" type="button" onClick={() => onDelete(sprint.id)}>
                {t('delete')}
              </Button>
            </div>
          }
        />
      ))}
    </section>
  )
}
