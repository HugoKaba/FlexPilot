import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSprintsQuery } from '@/entities/sprint'
import { useWorkItemsQuery, WorkItemDrawer, type WorkItem, type WorkItemPayload } from '@/entities/work-item'
import { useAuth } from '@/features/auth'
import { WorkItemFiltersPanel, workItemFiltersSchema, type WorkItemFilters } from '@/features/work-item-filters'
import { WorkItemForm, useCreateWorkItemMutation, useDeleteWorkItemMutation, useMoveWorkItemRankMutation, useUpdateWorkItemMutation } from '@/features/work-item-crud'
import { getFirebaseErrorMessage } from '@/shared/lib'
import { Button, Card, ErrorState, LoadingState } from '@/shared/ui'
import { BacklogList } from '@/widgets/backlog-list'

const readFilters = (params: URLSearchParams): WorkItemFilters => {
  return workItemFiltersSchema.parse({
    q: params.get('q') ?? '',
    type: params.get('type') ?? 'all',
    status: params.get('status') ?? 'all',
    priority: params.get('priority') ?? 'all',
    assignee: params.get('assignee') ?? '',
    sprintId: params.get('sprintId') ?? '',
  })
}

const toPayload = (item: WorkItem): WorkItemPayload => ({
  title: item.title,
  description: item.description,
  type: item.type,
  status: item.status,
  priority: item.priority,
  estimate: item.estimate,
  assignee: item.assignee,
  labels: item.labels,
  sprintId: item.sprintId,
  parentId: item.parentId,
})

export const BacklogPage = () => {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const [editingItem, setEditingItem] = useState<WorkItem | null>(null)
  const [drawerItem, setDrawerItem] = useState<WorkItem | null>(null)
  const [formVisible, setFormVisible] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const itemsQuery = useWorkItemsQuery(user?.uid)
  const sprintsQuery = useSprintsQuery(user?.uid)

  const createMutation = useCreateWorkItemMutation(user?.uid ?? '')
  const updateMutation = useUpdateWorkItemMutation(user?.uid ?? '', editingItem?.id ?? '')
  const deleteMutation = useDeleteWorkItemMutation(user?.uid ?? '')
  const moveRankMutation = useMoveWorkItemRankMutation(user?.uid ?? '')

  const filters = readFilters(searchParams)

  const filteredItems = useMemo(() => {
    const items = itemsQuery.data ?? []

    return items.filter((item) => {
      const matchText =
        item.title.toLowerCase().includes(filters.q.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.q.toLowerCase())
      const matchType = filters.type === 'all' || item.type === filters.type
      const matchStatus = filters.status === 'all' || item.status === filters.status
      const matchPriority = filters.priority === 'all' || item.priority === filters.priority
      const matchAssignee = !filters.assignee || item.assignee.toLowerCase().includes(filters.assignee.toLowerCase())
      const matchSprint = !filters.sprintId || item.sprintId === filters.sprintId

      return matchText && matchType && matchStatus && matchPriority && matchAssignee && matchSprint
    })
  }, [filters, itemsQuery.data])

  if (itemsQuery.isLoading || sprintsQuery.isLoading) {
    return <LoadingState text="Chargement backlog..." />
  }

  if (itemsQuery.isError || sprintsQuery.isError || !user || !itemsQuery.data || !sprintsQuery.data) {
    const details = itemsQuery.error ? getFirebaseErrorMessage(itemsQuery.error) : 'Erreur inconnue'

    return (
      <ErrorState
        title="Impossible de charger le backlog."
        details={
          <>
            <p>{details}</p>
            <a href="https://console.firebase.google.com/project/archi-front/firestore/indexes" target="_blank" rel="noreferrer">
              Créer les index Firestore
            </a>
          </>
        }
      />
    )
  }

  return (
    <section className="page">
      <div className="page-head">
        <div>
          <h1>Backlog</h1>
          <p className="page-subtitle">Priorise, édite et structure tes work items.</p>
        </div>
        <Button
          tone="primary"
          type="button"
          onClick={() => {
            setError(null)
            setEditingItem(null)
            setFormVisible((current) => !current)
          }}
        >
          {formVisible ? 'Fermer le formulaire' : 'Nouveau work item'}
        </Button>
      </div>

      <WorkItemFiltersPanel
        values={filters}
        sprints={sprintsQuery.data}
        onChange={(next) => {
          setSearchParams({
            q: next.q,
            type: next.type,
            status: next.status,
            priority: next.priority,
            assignee: next.assignee,
            sprintId: next.sprintId,
          })
        }}
      />

      {formVisible ? (
        <WorkItemForm
          initialValues={editingItem ? toPayload(editingItem) : undefined}
          isSaving={createMutation.isPending || updateMutation.isPending}
          onSubmit={async (values) => {
            setError(null)
            try {
              if (editingItem) {
                await updateMutation.mutateAsync(values)
              } else {
                await createMutation.mutateAsync(values)
              }

              setEditingItem(null)
              setFormVisible(false)
            } catch (mutationError) {
              setError(getFirebaseErrorMessage(mutationError))
            }
          }}
        />
      ) : null}

      {error ? (
        <Card className="state-error">
          <p>{error}</p>
        </Card>
      ) : null}

      <BacklogList
        items={filteredItems}
        onOpen={(item) => {
          setDrawerItem(item)
        }}
        onEdit={(item) => {
          setEditingItem(item)
          setFormVisible(true)
        }}
        onDelete={(itemId) => {
          void deleteMutation.mutateAsync(itemId)
        }}
        onMoveRank={(itemId, direction) => {
          void moveRankMutation.mutateAsync({ itemId, direction })
        }}
      />
      <WorkItemDrawer item={drawerItem} onClose={() => setDrawerItem(null)} />
    </section>
  )
}
