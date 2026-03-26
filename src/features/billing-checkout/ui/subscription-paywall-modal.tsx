import { loadStripe, type StripeEmbeddedCheckout } from '@stripe/stripe-js'
import { useEffect, useRef, useState } from 'react'
import { createEmbeddedCheckoutSession } from '@/features/billing-checkout/api/subscription-service'
import { useI18n } from '@/shared/lib'

interface SubscriptionPaywallModalProps {
  open: boolean
  userId?: string
  userEmail?: string
  onActivateSubscription: () => void
}

export const SubscriptionPaywallModal = ({ open, userId, userEmail, onActivateSubscription }: SubscriptionPaywallModalProps) => {
  const { t } = useI18n()
  const mountRef = useRef<HTMLDivElement | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || !mountRef.current || !userId) {
      return
    }

    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

    if (!publishableKey) {
      setErrorMessage(t('missingStripePublishableKey'))
      return
    }

    let destroyed = false
    let checkoutInstance: StripeEmbeddedCheckout | null = null

    const initializeCheckout = async () => {
      setLoading(true)
      setErrorMessage(null)

      try {
        const stripe = await loadStripe(publishableKey)

        if (!stripe) {
          throw new Error(t('stripeSdkInitError'))
        }

        checkoutInstance = await stripe.initEmbeddedCheckout({
          fetchClientSecret: async () => {
            const session = await createEmbeddedCheckoutSession({
              uid: userId,
              email: userEmail,
            })
            return session.clientSecret
          },
          onComplete: () => {
            onActivateSubscription()
          },
        })

        if (!destroyed && mountRef.current) {
          checkoutInstance.mount(mountRef.current)
        }
      } catch (error: unknown) {
        setErrorMessage(error instanceof Error ? error.message : t('stripeCheckoutStartError'))
      } finally {
        setLoading(false)
      }
    }

    void initializeCheckout()

    return () => {
      destroyed = true
      checkoutInstance?.destroy()
    }
  }, [onActivateSubscription, open, t, userEmail, userId])

  if (!open) {
    return null
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="paywall-title">
      <div className="card modal-card">
        <h2 id="paywall-title">{t('subscriptionRequired')}</h2>
        <p className="page-subtitle">{t('activateSubscriptionInline')}</p>

        <div ref={mountRef} className="embedded-checkout-slot" />
        {loading ? <p className="page-subtitle">{t('loadingStripeForm')}</p> : null}
        {errorMessage ? <p className="error">{errorMessage}</p> : null}

        <p className="page-subtitle">{t('stripeTestCardsHint')}</p>
      </div>
    </div>
  )
}
