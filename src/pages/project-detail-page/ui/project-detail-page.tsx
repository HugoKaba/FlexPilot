import { Link, useNavigate, useParams } from 'react-router-dom'
import { useProjectQuery } from '@/entities/project'
import { FavoriteButton } from '@/features/toggle-favorite'
import { useDeleteProjectMutation } from '@/features/project-crud'
import { useAuth } from '@/features/auth'

export const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const projectQuery = useProjectQuery(user?.uid, projectId)
  const deleteMutation = useDeleteProjectMutation(user?.uid ?? '')

  if (!projectId) {
    return <p className="card error">ID projet manquant.</p>
  }

  if (projectQuery.isLoading) {
    return <p className="status">Chargement du projet...</p>
  }

  if (projectQuery.isError || !projectQuery.data || !user) {
    return <p className="card error">Projet introuvable.</p>
  }

  const project = projectQuery.data

  return (
    <section className="page">
      <h1 style={{ margin: 0 }}>{project.title}</h1>

      <article className="card" style={{ display: 'grid', gap: 12 }}>
        <p style={{ margin: 0 }}>{project.description}</p>
        <p style={{ margin: 0 }}>Statut: {project.status}</p>
        <p style={{ margin: 0 }}>Budget: {project.budget}</p>

        <div className="actions">
          <FavoriteButton userId={user.uid} projectId={project.id} favorite={project.favorite} />

          <Link className="btn btn-muted" to={`/projects/${project.id}/edit`}>
            Éditer
          </Link>

          <button
            className="btn btn-danger"
            type="button"
            onClick={async () => {
              await deleteMutation.mutateAsync(project.id)
              navigate('/projects')
            }}
            disabled={deleteMutation.isPending}
          >
            Supprimer
          </button>
        </div>
      </article>
    </section>
  )
}
