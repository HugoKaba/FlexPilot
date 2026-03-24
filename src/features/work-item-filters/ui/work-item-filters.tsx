import type { WorkItemFilters } from '@/features/work-item-filters/model/work-item-filters'
import type { Sprint } from '@/entities/sprint'
import { FieldInput, FieldSelect } from '@/shared/ui'

export const WorkItemFiltersPanel = ({
  values,
  sprints,
  onChange,
}: {
  values: WorkItemFilters
  sprints: Sprint[]
  onChange: (next: WorkItemFilters) => void
}) => {
  return (
    <section className="card filters-grid">
      <label className="field">
        Recherche
        <FieldInput value={values.q} onChange={(event) => onChange({ ...values, q: event.target.value })} />
      </label>

      <label className="field">
        Type
        <FieldSelect value={values.type} onChange={(event) => onChange({ ...values, type: event.target.value as WorkItemFilters['type'] })}>
          <option value="all">Tous</option>
          <option value="epic">Epic</option>
          <option value="feature">Feature</option>
          <option value="story">Story</option>
          <option value="task">Task</option>
          <option value="bug">Bug</option>
        </FieldSelect>
      </label>

      <label className="field">
        Statut
        <FieldSelect value={values.status} onChange={(event) => onChange({ ...values, status: event.target.value as WorkItemFilters['status'] })}>
          <option value="all">Tous</option>
          <option value="todo">Todo</option>
          <option value="in_progress">In progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </FieldSelect>
      </label>

      <label className="field">
        Priorité
        <FieldSelect value={values.priority} onChange={(event) => onChange({ ...values, priority: event.target.value as WorkItemFilters['priority'] })}>
          <option value="all">Toutes</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </FieldSelect>
      </label>

      <label className="field">
        Assignee
        <FieldInput value={values.assignee} onChange={(event) => onChange({ ...values, assignee: event.target.value })} />
      </label>

      <label className="field">
        Sprint
        <FieldSelect value={values.sprintId} onChange={(event) => onChange({ ...values, sprintId: event.target.value })}>
          <option value="">Tous</option>
          {sprints.map((sprint) => (
            <option key={sprint.id} value={sprint.id}>
              {sprint.name}
            </option>
          ))}
        </FieldSelect>
      </label>
    </section>
  )
}
