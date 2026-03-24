import { useMemo, useState } from 'react'
import { useEnterpriseStore } from '@/shared/model'
import { Button, Card, FieldInput, FieldSelect } from '@/shared/ui'

export const WorkflowStudioPanel = () => {
  const workflows = useEnterpriseStore((state) => state.workflows)
  const updateWorkflowStatuses = useEnterpriseStore((state) => state.updateWorkflowStatuses)
  const [selectedType, setSelectedType] = useState<'epic' | 'feature' | 'story' | 'task' | 'bug'>('story')

  const workflow = useMemo(
    () => workflows.find((item) => item.type === selectedType) ?? workflows[0],
    [selectedType, workflows],
  )
  const [statusInput, setStatusInput] = useState(workflow.statuses.join(','))

  return (
    <Card className="enterprise-card">
      <h2>Workflow Studio</h2>
      <p className="page-subtitle">Workflows personnalisables par type, avec transitions validées.</p>

      <div className="grid-3">
        <label className="field">
          Type
          <FieldSelect
            value={selectedType}
            onChange={(event) => {
              const next = event.target.value as 'epic' | 'feature' | 'story' | 'task' | 'bug'
              setSelectedType(next)
              const nextWorkflow = workflows.find((item) => item.type === next)
              setStatusInput(nextWorkflow ? nextWorkflow.statuses.join(',') : 'todo,in_progress,review,done')
            }}
          >
            <option value="epic">Epic</option>
            <option value="feature">Feature</option>
            <option value="story">Story</option>
            <option value="task">Task</option>
            <option value="bug">Bug</option>
          </FieldSelect>
        </label>

        <label className="field">
          Statuses (comma)
          <FieldInput value={statusInput} onChange={(event) => setStatusInput(event.target.value)} />
        </label>

        <div className="field">
          <span>&nbsp;</span>
          <Button
            type="button"
            tone="primary"
            onClick={() => {
              const statuses = statusInput
                .split(',')
                .map((value) => value.trim())
                .filter(Boolean)

              if (statuses.length >= 2) {
                updateWorkflowStatuses(selectedType, statuses)
              }
            }}
          >
            Appliquer workflow
          </Button>
        </div>
      </div>

      <div className="enterprise-list">
        {workflow.transitions.map((transition, index) => (
          <article key={`${transition.from}_${transition.to}_${index}`} className="enterprise-item">
            <p><strong>{transition.from}</strong> → <strong>{transition.to}</strong></p>
          </article>
        ))}
      </div>
    </Card>
  )
}
