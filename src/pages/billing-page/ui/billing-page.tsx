import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { useI18n } from '@/shared/lib'
import { usePreferencesStore } from '@/shared/model'
import { Card } from '@/shared/ui'

export const BillingPage = () => {
  const { t } = useI18n()
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const subscriptionPlan = usePreferencesStore((state) => state.subscriptionPlan)
  const subscriptionStatus = usePreferencesStore((state) => state.subscriptionStatus)
  const setSubscriptionStatus = usePreferencesStore((state) => state.setSubscriptionStatus)

  useEffect(() => {
    const checkout = searchParams.get('checkout')
    if (checkout === 'cancelled' && subscriptionStatus !== 'active') {
      setSubscriptionStatus('inactive')
    }
  }, [searchParams, setSubscriptionStatus, subscriptionStatus])

  return (
    <section className="page">
      <div className="page-head">
        <h1>{t('billingTitle')}</h1>
        <p className="page-subtitle">{t('billingSubtitle')}</p>
      </div>

      <Card className="billing-status">
        <p>
          {t('currentPlan')}: <strong>{subscriptionPlan}</strong>
        </p>
        <p>
          {t('billingStatus')}: <strong>{subscriptionStatus}</strong>
        </p>
      </Card>

      <Card className="billing-test-cards">
        <h2>{t('activePlan')}</h2>
        <ul className="billing-list">
          <li>{t('planName')}: FlexPilot SaaS</li>
          <li>{t('type')}: {t('monthlySubscription')}</li>
          <li>Prix: 25€ / mois</li>
          <li>{t('account')}: {user?.email ?? t('unknown')}</li>
        </ul>
      </Card>

      <Card className="billing-test-cards">
        <h2>{t('stripeTestMode')}</h2>
        <p className="page-subtitle">{t('paywallCheckoutHint')}</p>
        <ul className="billing-list">
          <li>{t('testCardSuccess')}: 4242 4242 4242 4242</li>
          <li>{t('testCardDeclined')}: 4000 0000 0000 0002</li>
          <li>{t('testCard3ds')}: 4000 0025 0000 3155</li>
        </ul>
        <p className="page-subtitle">{t('testCardMeta')}</p>
      </Card>
    </section>
  )
}
