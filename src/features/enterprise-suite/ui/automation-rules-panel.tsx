import { useState } from 'react'
import { useEnterpriseStore } from '@/shared/model'
import { Button, Card, FieldInput, FieldSelect } from '@/shared/ui'

export const AutomationRulesPanel = () => {
  const rules = useEnterpriseStore((state) => state.rules)
  const addRule = useEnterpriseStore((state) => state.addRule)
  const toggleRule = useEnterpriseStore((state) => state.toggleRule)

  const [name, setName] = useState('')
  const [trigger, setTrigger] = useState<'on_status_change' | 'daily' | 'on_sprint_closed'>('on_status_change')
  const [condition, setCondition] = useState("status == 'done'")
  const [action, setAction] = useState('notify(team-channel)')

  return (
    <Card className="enterprise-card">
      <h2>Automation Rules</h2>
      <p className="page-subtitle">Triggers temporels, événements de workflow et actions automatiques.</p>

      <div className="grid-4">
        <label className="field">
          Nom
          <FieldInput value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label className="field">
          Trigger
          <FieldSelect value={trigger} onChange={(event) => setTrigger(event.target.value as 'on_status_change' | 'daily' | 'on_sprint_closed')}>
            <option value="on_status_change">on_status_change</option>
            <option value="daily">daily</option>
            <option value="on_sprint_closed">on_sprint_closed</option>
          </FieldSelect>
        </label>
        <label className="field">
          Condition
          <FieldInput value={condition} onChange={(event) => setCondition(event.target.value)} />
        </label>
        <label className="field">
          Action
          <FieldInput value={action} onChange={(event) => setAction(event.target.value)} />
        </label>
      </div>

      <Button
        type="button"
        tone="primary"
        disabled={!name.trim()}
        onClick={() => {
          addRule({
            name: name.trim(),
            trigger,
            condition,
            action,
            enabled: true,
          })
          setName('')
        }}
      >
        Ajouter règle
      </Button>

      <div className="enterprise-list">
        {rules.map((rule) => (
          <article key={rule.id} className="enterprise-item enterprise-row">
            <div>
              <p><strong>{rule.name}</strong></p>
              <p className="page-subtitle">{rule.trigger} · if {rule.condition} {'->'} {rule.action}</p>
            </div>
            <Button type="button" tone={rule.enabled ? 'primary' : 'muted'} onClick={() => toggleRule(rule.id)}>
              {rule.enabled ? 'Active' : 'Inactive'}
            </Button>
          </article>
        ))}
      </div>
    </Card>
  )
}
