import { Link } from 'react-router-dom'
import type { Sprint } from '@/entities/sprint'
import { SprintCard } from '@/entities/sprint'
import { Button, EmptyState } from '@/shared/ui'

export const SprintsList = ({
  sprints,
  onDelete,
}: {
  sprints: Sprint[]
  onDelete: (sprintId: string) => void
}) => {
  if (!sprints.length) {
    return <EmptyState title="Aucun sprint pour le moment." />
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
                Ouvrir
              </Link>
              <Button tone="danger" type="button" onClick={() => onDelete(sprint.id)}>
                Supprimer
              </Button>
            </div>
          }
        />
      ))}
    </section>
  )
}
