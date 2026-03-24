import { doc, getDoc, setDoc } from 'firebase/firestore'
import { z } from 'zod'
import { db } from '@/shared/api'
import type { SubscriptionPlan, SubscriptionStatus } from '@/shared/model'

const userSubscriptionSchema = z.object({
  subscriptionPlan: z.enum(['free', 'pro', 'business']).default('free'),
  subscriptionStatus: z.enum(['inactive', 'active', 'past_due']).default('inactive'),
})

export const readUserSubscription = async (uid: string): Promise<{ plan: SubscriptionPlan; status: SubscriptionStatus } | null> => {
  const snapshot = await getDoc(doc(db, 'users', uid))

  if (!snapshot.exists()) {
    return null
  }

  const parsed = userSubscriptionSchema.safeParse(snapshot.data())

  if (!parsed.success) {
    return null
  }

  return {
    plan: parsed.data.subscriptionPlan,
    status: parsed.data.subscriptionStatus,
  }
}

export const writeUserSubscription = async (uid: string, payload: { plan: SubscriptionPlan; status: SubscriptionStatus }): Promise<void> => {
  await setDoc(
    doc(db, 'users', uid),
    {
      subscriptionPlan: payload.plan,
      subscriptionStatus: payload.status,
      updatedAt: Date.now(),
    },
    { merge: true },
  )
}
