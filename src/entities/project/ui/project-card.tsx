import type { ReactNode } from 'react'
import type { Project } from '@/entities/project/model/project-schemas'
import { formatCurrency } from '@/shared/lib'
import { usePreferencesStore } from '@/shared/model'

export const ProjectCard = ({
  project,
  extra,
}: {
  project: Project
  extra?: ReactNode
}) => {
  const currency = usePreferencesStore((state) => state.currency)

  return (
    <article className="card" style={{ display: 'grid', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <h3 style={{ margin: 0 }}>{project.title}</h3>
        <span>{project.favorite ? 'Favori' : 'Standard'}</span>
      </div>
      <p style={{ margin: 0, color: 'var(--muted)' }}>{project.description}</p>
      <p style={{ margin: 0 }}>Budget: {formatCurrency(project.budget, currency)}</p>
      <p style={{ margin: 0 }}>Statut: {project.status}</p>
      {extra}
    </article>
  )
}
