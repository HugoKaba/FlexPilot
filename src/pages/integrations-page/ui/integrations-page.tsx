import { AutomationRulesPanel, DevopsIntegrationsPanel } from '@/features/enterprise-suite'

export const IntegrationsPage = () => {
  return (
    <section className="page">
      <div className="page-head">
        <h1>Integrations</h1>
        <p className="page-subtitle">Connecteurs DevOps, sync PR/pipelines et règles d’automatisation.</p>
      </div>
      <DevopsIntegrationsPanel />
      <AutomationRulesPanel />
    </section>
  )
}
