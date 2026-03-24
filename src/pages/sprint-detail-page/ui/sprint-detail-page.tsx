import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useSprintQuery, useSprintsQuery } from '@/entities/sprint'
import { useWorkItemsQuery } from '@/entities/work-item'
import { useAssignWorkItemSprintMutation } from '@/features/board-actions'
import { useAuth } from '@/features/auth'
import { Button, Card, ErrorState, LoadingState } from '@/shared/ui'

export const SprintDetailPage = () => {
  const { sprintId } = useParams<{ sprintId: string }>()
  const { user } = useAuth()

  const sprintQuery = useSprintQuery(user?.uid, sprintId)
  const itemsQuery = useWorkItemsQuery(user?.uid)
  const sprintsQuery = useSprintsQuery(user?.uid)
  const assignMutation = useAssignWorkItemSprintMutation(user?.uid ?? '')

  const stats = useMemo(() => {
    const sprint = sprintQuery.data
    const items = itemsQuery.data ?? []

    if (!sprint) {
      return null
    }

    const sprintItems = items.filter((item) => item.sprintId === sprint.id)
    const done = sprintItems.filter((item) => item.status === 'done')

    return {
      total: sprintItems.length,
      done: done.length,
      totalPoints: sprintItems.reduce((sum, item) => sum + item.estimate, 0),
      donePoints: done.reduce((sum, item) => sum + item.estimate, 0),
      sprintItems,
    }
  }, [itemsQuery.data, sprintQuery.data])

  if (sprintQuery.isLoading || itemsQuery.isLoading || sprintsQuery.isLoading) {
    return <LoadingState text="Chargement sprint..." />
  }

  if (!sprintId || sprintQuery.isError || itemsQuery.isError || !sprintQuery.data || !itemsQuery.data || !sprintsQuery.data) {
    return <ErrorState title="Impossible de charger le détail sprint." />
  }

  const sprint = sprintQuery.data
  const backlogItems = itemsQuery.data.filter((item) => !item.sprintId || item.sprintId !== sprint.id)

  return (
    <section className="page">
      <div className="page-head">
        <div>
          <h1>{sprint.name}</h1>
          <p className="page-subtitle">Objectif: {sprint.goal}</p>
        </div>
      </div>

      <Card className="kpi-card">
        <h2>Progression sprint</h2>
        <p>
          Progression items: {stats?.done ?? 0}/{stats?.total ?? 0}
        </p>
        <p>
          Progression points: {stats?.donePoints ?? 0}/{stats?.totalPoints ?? 0}
        </p>
      </Card>

      <Card>
        <h2>Items du sprint</h2>
        {(stats?.sprintItems ?? []).map((item) => (
          <div key={item.id} className="inline-row">
            <span>{item.title}</span>
            <Button type="button" tone="muted" onClick={() => void assignMutation.mutateAsync({ itemId: item.id, sprintId: null })}>
              Retirer
            </Button>
          </div>
        ))}
      </Card>

      <Card>
        <h2>Backlog disponible</h2>
        {backlogItems.map((item) => (
          <div key={item.id} className="inline-row">
            <span>{item.title}</span>
            <Button type="button" tone="primary" onClick={() => void assignMutation.mutateAsync({ itemId: item.id, sprintId: sprint.id })}>
              Ajouter
            </Button>
          </div>
        ))}
      </Card>
    </section>
  )
}
