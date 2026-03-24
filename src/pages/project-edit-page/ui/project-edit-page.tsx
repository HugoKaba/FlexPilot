import { useNavigate, useParams } from 'react-router-dom'
import { useProjectQuery } from '@/entities/project'
import { ProjectForm, useCreateProjectMutation, useUpdateProjectMutation } from '@/features/project-crud'
import { useAuth } from '@/features/auth'

export const ProjectEditPage = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const isEditMode = Boolean(projectId)
  const navigate = useNavigate()
  const { user } = useAuth()

  const createMutation = useCreateProjectMutation(user?.uid ?? '')
  const updateMutation = useUpdateProjectMutation(user?.uid ?? '', projectId ?? '')
  const projectQuery = useProjectQuery(user?.uid, projectId)

  if (!user) {
    return <p className="card error">Utilisateur non connecté.</p>
  }

  if (isEditMode && projectQuery.isLoading) {
    return <p className="status">Chargement du projet...</p>
  }

  if (isEditMode && (projectQuery.isError || !projectQuery.data)) {
    return <p className="card error">Projet introuvable.</p>
  }

  return (
    <section className="page">
      <h1 style={{ margin: 0 }}>{isEditMode ? 'Modifier le projet' : 'Créer un projet'}</h1>

      <ProjectForm
        initialValues={
          isEditMode && projectQuery.data
            ? {
                title: projectQuery.data.title,
                description: projectQuery.data.description,
                status: projectQuery.data.status,
                budget: projectQuery.data.budget,
              }
            : undefined
        }
        isSaving={createMutation.isPending || updateMutation.isPending}
        onSubmit={async (values) => {
          if (isEditMode && projectId) {
            await updateMutation.mutateAsync(values)
            navigate(`/projects/${projectId}`)
            return
          }

          await createMutation.mutateAsync(values)
          navigate('/projects')
        }}
      />
    </section>
  )
}
