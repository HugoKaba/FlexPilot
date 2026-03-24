import type { Sprint } from '@/entities/sprint'
import type { WorkItem } from '@/entities/work-item'
import { Card } from '@/shared/ui'

export const SprintOverview = ({
  sprints,
  items,
}: {
  sprints: Sprint[]
  items: WorkItem[]
}) => {
  const activeSprint = sprints.find((sprint) => sprint.status === 'active')

  if (!activeSprint) {
    return <Card>Aucun sprint actif actuellement.</Card>
  }

  const sprintItems = items.filter((item) => item.sprintId === activeSprint.id)
  const done = sprintItems.filter((item) => item.status === 'done')
  const totalEstimate = sprintItems.reduce((sum, item) => sum + item.estimate, 0)
  const doneEstimate = done.reduce((sum, item) => sum + item.estimate, 0)

  return (
    <Card className="kpi-card">
      <h2>{activeSprint.name}</h2>
      <p>{activeSprint.goal}</p>
      <p>
        Progression items: {done.length}/{sprintItems.length}
      </p>
      <p>
        Progression points: {doneEstimate}/{totalEstimate}
      </p>
    </Card>
  )
}
