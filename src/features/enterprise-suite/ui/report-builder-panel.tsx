import { useEnterpriseStore } from '@/shared/model'
import { Button, Card } from '@/shared/ui'

export const ReportBuilderPanel = () => {
  const widgets = useEnterpriseStore((state) => state.widgets)
  const toggleWidget = useEnterpriseStore((state) => state.toggleWidget)

  return (
    <Card className="enterprise-card">
      <h2>Reporting Builder</h2>
      <p className="page-subtitle">Widgets configurables + formules custom pour dashboards enterprise.</p>
      <div className="enterprise-list">
        {widgets.map((widget) => (
          <article key={widget.id} className="enterprise-item enterprise-row">
            <div>
              <p><strong>{widget.title}</strong> ({widget.type})</p>
              <p className="page-subtitle">Formula: {widget.formula}</p>
            </div>
            <Button type="button" tone={widget.visible ? 'primary' : 'muted'} onClick={() => toggleWidget(widget.id)}>
              {widget.visible ? 'Visible' : 'Hidden'}
            </Button>
          </article>
        ))}
      </div>
    </Card>
  )
}
