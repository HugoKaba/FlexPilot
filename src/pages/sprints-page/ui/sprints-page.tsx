import { useState } from 'react'
import { useSprintsQuery } from '@/entities/sprint'
import { useAuth } from '@/features/auth'
import { SprintForm, useCreateSprintMutation, useDeleteSprintMutation } from '@/features/sprint-crud'
import { getFirebaseErrorMessage } from '@/shared/lib'
import { Button, ErrorState, LoadingState } from '@/shared/ui'
import { SprintsList } from '@/widgets/sprints-list'

export const SprintsPage = () => {
  const { user } = useAuth()
  const sprintsQuery = useSprintsQuery(user?.uid)

  const createMutation = useCreateSprintMutation(user?.uid ?? '')
  const deleteMutation = useDeleteSprintMutation(user?.uid ?? '')

  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (sprintsQuery.isLoading) {
    return <LoadingState text="Chargement sprints..." />
  }

  if (sprintsQuery.isError || !sprintsQuery.data || !user) {
    const details = sprintsQuery.error ? getFirebaseErrorMessage(sprintsQuery.error) : undefined
    return <ErrorState title="Impossible de charger les sprints." details={<p>{details}</p>} />
  }

  return (
    <section className="page">
      <div className="page-head">
        <div>
          <h1>Sprints</h1>
          <p className="page-subtitle">Planifie et pilote les cycles de livraison.</p>
        </div>
        <Button tone="primary" type="button" onClick={() => setShowForm((state) => !state)}>
          {showForm ? 'Fermer le formulaire' : 'Nouveau sprint'}
        </Button>
      </div>

      {showForm ? (
        <SprintForm
          isSaving={createMutation.isPending}
          onSubmit={async (values) => {
            setError(null)
            try {
              await createMutation.mutateAsync(values)
              setShowForm(false)
            } catch (mutationError) {
              setError(getFirebaseErrorMessage(mutationError))
            }
          }}
        />
      ) : null}

      {error ? <ErrorState title={error} /> : null}

      <SprintsList
        sprints={sprintsQuery.data}
        onDelete={(sprintId) => {
          void deleteMutation.mutateAsync(sprintId)
        }}
      />
    </section>
  )
}
