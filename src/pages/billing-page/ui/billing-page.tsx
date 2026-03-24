import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { usePreferencesStore } from '@/shared/model'
import { Card } from '@/shared/ui'

export const BillingPage = () => {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const subscriptionPlan = usePreferencesStore((state) => state.subscriptionPlan)
  const subscriptionStatus = usePreferencesStore((state) => state.subscriptionStatus)
  const setSubscriptionPlan = usePreferencesStore((state) => state.setSubscriptionPlan)
  const setSubscriptionStatus = usePreferencesStore((state) => state.setSubscriptionStatus)

  useEffect(() => {
    const checkout = searchParams.get('checkout')
    if (checkout === 'cancelled' && subscriptionStatus !== 'active') {
      setSubscriptionStatus('inactive')
    }
  }, [searchParams, setSubscriptionPlan, setSubscriptionStatus, subscriptionStatus])

  return (
    <section className="page">
      <div className="page-head">
        <h1>Billing & Abonnement</h1>
        <p className="page-subtitle">Informations d’abonnement et statut de facturation.</p>
      </div>

      <Card className="billing-status">
        <p>
          Plan actuel: <strong>{subscriptionPlan}</strong>
        </p>
        <p>
          Statut: <strong>{subscriptionStatus}</strong>
        </p>
      </Card>

      <Card className="billing-test-cards">
        <h2>Plan actif</h2>
        <ul className="billing-list">
          <li>Nom: FlexPilot SaaS</li>
          <li>Type: Abonnement mensuel</li>
          <li>Prix: 25€ / mois</li>
          <li>Compte: {user?.email ?? 'inconnu'}</li>
        </ul>
      </Card>

      <Card className="billing-test-cards">
        <h2>Stripe Test Mode (cartes)</h2>
        <p className="page-subtitle">Le paiement se fait via la pop-in après connexion/inscription.</p>
        <ul className="billing-list">
          <li>Succès paiement: 4242 4242 4242 4242</li>
          <li>Carte refusée: 4000 0000 0000 0002</li>
          <li>Authentification 3D Secure: 4000 0025 0000 3155</li>
        </ul>
        <p className="page-subtitle">Date: future, CVC: 3 chiffres, code postal: valide.</p>
      </Card>
    </section>
  )
}
