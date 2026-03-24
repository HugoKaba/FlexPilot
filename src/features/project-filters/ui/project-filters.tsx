import type { ProjectFilters } from '@/features/project-filters/model/project-filters'

interface ProjectFiltersProps {
  values: ProjectFilters
  onChange: (next: ProjectFilters) => void
}

export const ProjectFiltersPanel = ({ values, onChange }: ProjectFiltersProps) => {
  return (
    <section className="card" style={{ display: 'grid', gap: 12 }}>
      <h2 style={{ margin: 0 }}>Filtres</h2>
      <div className="grid-2">
        <label className="field" htmlFor="search">
          Recherche
          <input
            id="search"
            value={values.search}
            onChange={(event) => onChange({ ...values, search: event.target.value })}
            placeholder="Rechercher un projet..."
          />
        </label>

        <label className="field" htmlFor="status">
          Statut
          <select
            id="status"
            value={values.status}
            onChange={(event) =>
              onChange({
                ...values,
                status: event.target.value as ProjectFilters['status'],
              })
            }
          >
            <option value="all">Tous</option>
            <option value="planned">Planned</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </label>
      </div>
    </section>
  )
}
