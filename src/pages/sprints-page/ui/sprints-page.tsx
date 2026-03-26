import { useState } from 'react'
import { useSprintsQuery } from '@/entities/sprint'
import { useAuth } from '@/features/auth'
import { SprintForm, useCreateSprintMutation, useDeleteSprintMutation } from '@/features/sprint-crud'
import { getFirebaseErrorMessage, useI18n } from '@/shared/lib'
import { Button, ErrorState, LoadingState } from '@/shared/ui'
import { SprintsList } from '@/widgets/sprints-list'

export const SprintsPage = () => {
  const { t } = useI18n()
  const { user } = useAuth()
  const sprintsQuery = useSprintsQuery(user?.uid)

  const createMutation = useCreateSprintMutation(user?.uid ?? '')
  const deleteMutation = useDeleteSprintMutation(user?.uid ?? '')

  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (sprintsQuery.isLoading) {
    return <LoadingState text={t('loadingSprints')} />
  }

  if (sprintsQuery.isError || !sprintsQuery.data || !user) {
    const details = sprintsQuery.error ? getFirebaseErrorMessage(sprintsQuery.error) : undefined
    return <ErrorState title={t('sprintsLoadError')} details={<p>{details}</p>} />
  }

  return (
    <section className="page">
      <div className="page-head">
        <div>
          <h1>{t('sprintsTitle')}</h1>
          <p className="page-subtitle">{t('sprintsSubtitle')}</p>
        </div>
        <Button tone="primary" type="button" onClick={() => setShowForm((state) => !state)}>
          {showForm ? t('closeForm') : t('newSprint')}
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
