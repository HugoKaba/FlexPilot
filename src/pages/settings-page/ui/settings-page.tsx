import { Link } from 'react-router-dom'
import { WorkflowStudioPanel } from '@/features/enterprise-suite'
import { PreferencesForm } from '@/features/settings-preferences'
import { ThemeToggle } from '@/features/theme-toggle'
import { usePreferencesStore } from '@/shared/model'
import { Button } from '@/shared/ui'

export const SettingsPage = () => {
  const subscriptionPlan = usePreferencesStore((state) => state.subscriptionPlan)
  const subscriptionStatus = usePreferencesStore((state) => state.subscriptionStatus)

  return (
    <section className="page">
      <div className="page-head">
        <h1>Profil & Paramètres</h1>
        <p className="page-subtitle">Personnalise ton espace de travail.</p>
      </div>
      <section className="card">
        <h2>App Theme</h2>
        <ThemeToggle />
      </section>
      <section className="card settings-billing">
        <div>
          <h2>Abonnement</h2>
          <p className="page-subtitle">
            Plan: <strong>{subscriptionPlan}</strong> · Statut: <strong>{subscriptionStatus}</strong>
          </p>
        </div>
        <Link to="/billing">
          <Button type="button" tone="primary">
            Gérer Billing
          </Button>
        </Link>
      </section>
      <WorkflowStudioPanel />
      <PreferencesForm />
    </section>
  )
}
