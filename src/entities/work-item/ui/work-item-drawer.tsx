import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  workItemPrioritySchema,
  workItemStatusSchema,
  workItemTypeSchema,
  type WorkItem,
  type WorkItemPayload,
} from '@/entities/work-item/model/work-item-schemas'
import { Badge, Button } from '@/shared/ui'

export const WorkItemDrawer = ({
  item,
  onClose,
  onSave,
}: {
  item: WorkItem | null
  onClose: () => void
  onSave?: (itemId: string, payload: WorkItemPayload) => Promise<void>
}) => {
  const buildFormState = (value: WorkItem | null): WorkItemPayload => ({
    title: value?.title ?? '',
    description: value?.description ?? '',
    type: value?.type ?? 'task',
    status: value?.status ?? 'todo',
    priority: value?.priority ?? 'medium',
    estimate: value?.estimate ?? 0,
    assignee: value?.assignee ?? '',
    labels: value?.labels ?? [],
    sprintId: value?.sprintId ?? null,
    parentId: value?.parentId ?? null,
  })

  const [tab, setTab] = useState<'details' | 'edit' | 'activity'>('details')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formState, setFormState] = useState<WorkItemPayload>(() => buildFormState(item))
  const [labelsText, setLabelsText] = useState(() => item?.labels.join(', ') ?? '')

  useEffect(() => {
    if (!item) {
      return
    }
    setTab('details')
    setError(null)
    setFormState(buildFormState(item))
    setLabelsText(item.labels.join(', '))
  }, [item])

  if (!item) {
    return null
  }

  return (
    <aside className="item-drawer-overlay" onClick={onClose}>
      <div className="item-drawer" onClick={(event) => event.stopPropagation()}>
        <div className="item-drawer-head">
          <div>
            <h2>{item.title}</h2>
            <p className="page-subtitle">#{item.id.slice(0, 8)} · {item.type}</p>
          </div>
          <Button type="button" tone="muted" onClick={onClose}>
            Fermer
          </Button>
        </div>

        <div className="drawer-tabs">
          <button className={`drawer-tab ${tab === 'details' ? 'active' : ''}`} type="button" onClick={() => setTab('details')}>
            Détails
          </button>
          <button className={`drawer-tab ${tab === 'edit' ? 'active' : ''}`} type="button" onClick={() => setTab('edit')}>
            Édition
          </button>
          <button className={`drawer-tab ${tab === 'activity' ? 'active' : ''}`} type="button" onClick={() => setTab('activity')}>
            Activité
          </button>
        </div>

        {tab === 'details' ? (
          <>
            <div className="work-item-meta">
              <Badge>{item.status}</Badge>
              <Badge>P{item.priority}</Badge>
              <Badge>{item.assignee}</Badge>
              <Badge>{item.estimate} pts</Badge>
              {item.sprintId ? <Badge>Sprint: {item.sprintId}</Badge> : null}
            </div>
            <p>{item.description}</p>
            <div className="actions">
              <Link to={`/work-items/${item.id}`} className="btn btn-primary" onClick={onClose}>
                Ouvrir fiche complète
              </Link>
            </div>
          </>
        ) : null}

        {tab === 'edit' ? (
          <form
            className="drawer-edit-form"
            onSubmit={async (event) => {
              event.preventDefault()
              setError(null)
              if (!onSave) {
                setError('Édition non disponible depuis cette vue.')
                return
              }

              try {
                setSaving(true)
                const nextPayload: WorkItemPayload = {
                  ...formState,
                  labels: labelsText
                    .split(',')
                    .map((label) => label.trim())
                    .filter((label) => label.length > 0),
                }
                await onSave(item.id, nextPayload)
                onClose()
              } catch {
                setError('Impossible de sauvegarder la tâche.')
              } finally {
                setSaving(false)
              }
            }}
          >
            <label className="field">
              Titre
              <input value={formState.title} onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))} />
            </label>
            <label className="field">
              Description
              <textarea
                rows={4}
                value={formState.description}
                onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
              />
            </label>
            <div className="grid-2">
              <label className="field">
                Type
                <select
                  value={formState.type}
                  onChange={(event) => setFormState((prev) => ({ ...prev, type: event.target.value as WorkItemPayload['type'] }))}
                >
                  {workItemTypeSchema.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Statut
                <select
                  value={formState.status}
                  onChange={(event) => setFormState((prev) => ({ ...prev, status: event.target.value as WorkItemPayload['status'] }))}
                >
                  {workItemStatusSchema.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Priorité
                <select
                  value={formState.priority}
                  onChange={(event) => setFormState((prev) => ({ ...prev, priority: event.target.value as WorkItemPayload['priority'] }))}
                >
                  {workItemPrioritySchema.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Points
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={formState.estimate}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      estimate: Number.isNaN(Number(event.target.value)) ? 0 : Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="field">
                Assignee
                <input value={formState.assignee} onChange={(event) => setFormState((prev) => ({ ...prev, assignee: event.target.value }))} />
              </label>
              <label className="field">
                Labels (séparés par virgule)
                <input value={labelsText} onChange={(event) => setLabelsText(event.target.value)} />
              </label>
            </div>
            {error ? <p className="error">{error}</p> : null}
            <div className="actions">
              <Button type="submit" tone="primary" disabled={saving}>
                {saving ? 'Sauvegarde...' : 'Enregistrer'}
              </Button>
            </div>
          </form>
        ) : null}

        {tab === 'activity' ? (
          <div className="drawer-activity">
            <article className="activity-item">
              <strong>Création</strong>
              <p className="page-subtitle">{new Date(item.createdAt).toLocaleString()}</p>
            </article>
            <article className="activity-item">
              <strong>Dernière mise à jour</strong>
              <p className="page-subtitle">{new Date(item.updatedAt).toLocaleString()}</p>
            </article>
            <article className="activity-item">
              <strong>Workflow</strong>
              <p className="page-subtitle">Statut courant: {item.status}</p>
            </article>
          </div>
        ) : null}
      </div>
    </aside>
  )
}
