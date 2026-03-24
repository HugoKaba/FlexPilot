import { z } from 'zod'

export type BillingPlanId = 'pro' | 'business'

interface CheckoutInput {
  plan: BillingPlanId
  userId?: string
  customerEmail?: string
}

const envSchema = z.object({
  publishableKey: z.string().optional(),
})

type StripeEnv = z.infer<typeof envSchema>

const stripeEnv: StripeEnv = envSchema.parse({
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
})

export const hasBillingConfiguration = (): boolean => {
  return Boolean(stripeEnv.publishableKey)
}

export const startStripeCheckout = async ({ plan, userId, customerEmail }: CheckoutInput): Promise<void> => {
  throw new Error(
    `Le flux paiement utilise maintenant Embedded Checkout en pop-in. Plan ${plan}, userId ${userId ?? 'n/a'}, email ${customerEmail ?? 'n/a'}.`,
  )
}
