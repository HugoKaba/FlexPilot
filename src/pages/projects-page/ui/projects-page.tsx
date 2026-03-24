import { Link, useSearchParams } from 'react-router-dom'
import { useProjectsQuery } from '@/entities/project'
import type { ProjectFilters } from '@/features/project-filters'
import { projectFiltersSchema, ProjectFiltersPanel } from '@/features/project-filters'
import { useAuth } from '@/features/auth'
import { ProjectList } from '@/widgets/project-list'

const getFiltersFromParams = (params: URLSearchParams): ProjectFilters => {
  return projectFiltersSchema.parse({
    search: params.get('search') ?? '',
    status: params.get('status') ?? 'all',
  })
}

export const ProjectsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()
  const projectsQuery = useProjectsQuery(user?.uid)

  const filters = getFiltersFromParams(searchParams)

  const filteredProjects = (projectsQuery.data ?? []).filter((project) => {
    const searchMatch = project.title.toLowerCase().includes(filters.search.toLowerCase())
    const statusMatch = filters.status === 'all' || project.status === filters.status
    return searchMatch && statusMatch
  })

  return (
    <section className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <h1 style={{ margin: 0 }}>Projets</h1>
        <Link className="btn btn-primary" to="/projects/new">
          Nouveau projet
        </Link>
      </div>

      <ProjectFiltersPanel
        values={filters}
        onChange={(next) => {
          setSearchParams({
            search: next.search,
            status: next.status,
          })
        }}
      />

      {projectsQuery.isLoading ? <p className="status">Chargement des projets...</p> : null}
      {projectsQuery.isError ? <p className="card error">Impossible de charger les projets.</p> : null}

      {!projectsQuery.isLoading && user ? <ProjectList projects={filteredProjects} userId={user.uid} /> : null}
    </section>
  )
}
