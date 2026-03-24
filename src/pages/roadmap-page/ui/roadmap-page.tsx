import { useAuth } from '@/features/auth'
import { PortfolioStudioPanel } from '@/features/enterprise-suite'
import { useSprintsQuery } from '@/entities/sprint'
import { useWorkItemsQuery } from '@/entities/work-item'
import { ErrorState, LoadingState } from '@/shared/ui'
import { RoadmapTimeline } from '@/widgets/roadmap-timeline'

export const RoadmapPage = () => {
  const { user } = useAuth()
  const sprintsQuery = useSprintsQuery(user?.uid)
  const itemsQuery = useWorkItemsQuery(user?.uid)

  if (sprintsQuery.isLoading || itemsQuery.isLoading) {
    return <LoadingState text="Chargement roadmap..." />
  }

  if (sprintsQuery.isError || itemsQuery.isError || !sprintsQuery.data || !itemsQuery.data) {
    return <ErrorState title="Impossible de charger la roadmap." />
  }

  return (
    <section className="page">
      <div className="page-head">
        <h1>Roadmap</h1>
        <p className="page-subtitle">Vision delivery + portfolio multi-niveaux avec dépendances.</p>
      </div>
      <PortfolioStudioPanel />
      <RoadmapTimeline sprints={sprintsQuery.data} items={itemsQuery.data} />
    </section>
  )
}
