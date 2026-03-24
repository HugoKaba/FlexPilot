import { useState } from 'react'
import { startStripeCheckout, type BillingPlanId } from '@/features/billing-checkout/model/stripe-checkout'
import { Button, Card } from '@/shared/ui'

interface BillingPlansProps {
  userId?: string
  customerEmail?: string
  onSubscribed: (plan: BillingPlanId) => void
}

const planCatalog: Array<{ id: BillingPlanId; title: string; price: string; description: string; cta: string; highlights: string[] }> = [
  {
    id: 'pro',
    title: 'Abonnement SaaS',
    price: '25€ / mois',
    description: 'Abonnement requis pour accéder aux modules Backlog, Board, Sprint, Reports et Team.',
    cta: 'Payer 25€ / mois',
    highlights: ['Accès complet à la plateforme', 'Theme + paramètres persistants', 'Roadmap et dashboard delivery'],
  },
]

export const BillingPlans = ({ userId, customerEmail, onSubscribed }: BillingPlansProps) => {
  const [loadingPlan, setLoadingPlan] = useState<BillingPlanId | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleCheckout = async (plan: BillingPlanId) => {
    setLoadingPlan(plan)
    setErrorMessage(null)

    try {
      await startStripeCheckout({
        plan,
        userId,
        customerEmail,
      })
      onSubscribed(plan)
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'Impossible de démarrer le paiement Stripe.')
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <section className="billing-grid">
      {planCatalog.map((plan) => (
        <Card key={plan.id} className="billing-card">
          <p className="billing-tier">{plan.title}</p>
          <h2 className="billing-price">{plan.price}</h2>
          <p className="work-item-description">{plan.description}</p>

          <ul className="billing-list">
            {plan.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>

          <Button
            type="button"
            tone="primary"
            onClick={() => void handleCheckout(plan.id)}
            disabled={loadingPlan !== null}
          >
            {loadingPlan === plan.id ? 'Redirection Stripe...' : plan.cta}
          </Button>
        </Card>
      ))}

      {errorMessage ? <p className="error">{errorMessage}</p> : null}
    </section>
  )
}
