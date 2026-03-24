import { useAuth } from '@/features/auth'
import { GovernancePanel, TeamStructurePanel } from '@/features/enterprise-suite'
import { TeamInvitePanel } from '@/features/team-invite'
import { useWorkItemsQuery } from '@/entities/work-item'
import { ErrorState, LoadingState } from '@/shared/ui'
import { TeamWorkload } from '@/widgets/team-workload'

export const TeamPage = () => {
  const { user } = useAuth()
  const itemsQuery = useWorkItemsQuery(user?.uid)

  if (itemsQuery.isLoading) {
    return <LoadingState text="Chargement team..." />
  }

  if (itemsQuery.isError || !itemsQuery.data) {
    return <ErrorState title="Impossible de charger la vue équipe." />
  }

  return (
    <section className="page">
      <div className="page-head">
        <h1>Team</h1>
        <p className="page-subtitle">Répartition de charge par assignee.</p>
      </div>
      <TeamWorkload items={itemsQuery.data} />
      <TeamStructurePanel />
      <TeamInvitePanel />
      <GovernancePanel />
    </section>
  )
}
