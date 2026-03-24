import { Link } from 'react-router-dom'
import { ProjectCard, type Project } from '@/entities/project'
import { FavoriteButton } from '@/features/toggle-favorite'

interface ProjectListProps {
  projects: Project[]
  userId: string
}

export const ProjectList = ({ projects, userId }: ProjectListProps) => {
  if (!projects.length) {
    return <p className="card">Aucun projet trouvé.</p>
  }

  return (
    <section className="page">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          extra={
            <div className="actions">
              <FavoriteButton userId={userId} projectId={project.id} favorite={project.favorite} />
              <Link className="btn btn-muted" to={`/projects/${project.id}`}>
                Détail
              </Link>
              <Link className="btn btn-muted" to={`/projects/${project.id}/edit`}>
                Éditer
              </Link>
            </div>
          }
        />
      ))}
    </section>
  )
}
