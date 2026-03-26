import { AutomationRulesPanel, DevopsIntegrationsPanel } from '@/features/enterprise-suite'
import { useI18n } from '@/shared/lib'

export const IntegrationsPage = () => {
  const { t } = useI18n()

  return (
    <section className="page">
      <div className="page-head">
        <h1>{t('integrationsTitle')}</h1>
        <p className="page-subtitle">{t('integrationsSubtitle')}</p>
      </div>
      <DevopsIntegrationsPanel />
      <AutomationRulesPanel />
    </section>
  )
}
