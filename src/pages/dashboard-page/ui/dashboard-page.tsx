import { FirebaseError } from 'firebase/app'
import { useSprintsQuery } from '@/entities/sprint'
import { useWorkItemsQuery } from '@/entities/work-item'
import { useAuth } from '@/features/auth'
import { getFirebaseErrorMessage } from '@/shared/lib'
import { ErrorState, LoadingState } from '@/shared/ui'
import { DashboardOverview } from '@/widgets/dashboard-overview'
import { SprintOverview } from '@/widgets/sprint-overview'

export const DashboardPage = () => {
  const { user } = useAuth()
  const workItemsQuery = useWorkItemsQuery(user?.uid)
  const sprintsQuery = useSprintsQuery(user?.uid)

  if (workItemsQuery.isLoading || sprintsQuery.isLoading) {
    return <LoadingState text="Chargement dashboard..." />
  }

  if (workItemsQuery.isError || sprintsQuery.isError || !workItemsQuery.data || !sprintsQuery.data) {
    const sourceError = workItemsQuery.error ?? sprintsQuery.error
    const details = sourceError ? getFirebaseErrorMessage(sourceError) : undefined
    const showIndexHelp = sourceError instanceof FirebaseError && sourceError.code === 'failed-precondition'

    return (
      <ErrorState
        title="Impossible de charger le dashboard."
        details={
          <>
            <p>{details}</p>
            {showIndexHelp ? (
              <a href="https://console.firebase.google.com/project/archi-front/firestore/indexes" target="_blank" rel="noreferrer">
                Créer les index Firestore
              </a>
            ) : null}
          </>
        }
      />
    )
  }

  return (
    <section className="page">
      <div className="page-head">
        <h1>Dashboard</h1>
        <p className="page-subtitle">Vue d’ensemble de ton flux de delivery.</p>
      </div>
      <DashboardOverview projects={workItemsQuery.data} />
      <SprintOverview sprints={sprintsQuery.data} items={workItemsQuery.data} />
    </section>
  )
}
