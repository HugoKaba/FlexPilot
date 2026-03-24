import { useAuth } from '@/features/auth'
import { ReportBuilderPanel } from '@/features/enterprise-suite'
import { useSprintsQuery } from '@/entities/sprint'
import { useWorkItemsQuery } from '@/entities/work-item'
import { ErrorState, LoadingState } from '@/shared/ui'
import { ReportsPanels } from '@/widgets/reports-panels'

export const ReportsPage = () => {
  const { user } = useAuth()
  const sprintsQuery = useSprintsQuery(user?.uid)
  const itemsQuery = useWorkItemsQuery(user?.uid)

  if (sprintsQuery.isLoading || itemsQuery.isLoading) {
    return <LoadingState text="Chargement reports..." />
  }

  if (sprintsQuery.isError || itemsQuery.isError || !sprintsQuery.data || !itemsQuery.data) {
    return <ErrorState title="Impossible de charger les reports." />
  }

  return (
    <section className="page">
      <div className="page-head">
        <h1>Reports</h1>
        <p className="page-subtitle">Suivi de capacité, flow, santé du delivery et widgets configurables.</p>
      </div>
      <ReportBuilderPanel />
      <ReportsPanels items={itemsQuery.data} sprints={sprintsQuery.data} />
    </section>
  )
}
