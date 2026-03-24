import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { readUserSubscription, verifyCheckoutSession, writeUserSubscription } from '@/features/billing-checkout/api'
import type { SubscriptionPlan, SubscriptionStatus } from '@/shared/model'
import { queryKeys } from '@/shared/lib'

export const useUserSubscriptionQuery = (uid: string | undefined) => {
  return useQuery({
    queryKey: uid ? queryKeys.subscriptions.user(uid) : queryKeys.subscriptions.all,
    queryFn: () => {
      if (!uid) {
        throw new Error('uid manquant')
      }
      return readUserSubscription(uid)
    },
    enabled: Boolean(uid),
  })
}

export const useVerifyCheckoutSessionQuery = (uid: string | undefined, sessionId: string | undefined) => {
  return useQuery({
    queryKey: uid && sessionId ? queryKeys.subscriptions.verifySession(uid, sessionId) : queryKeys.subscriptions.all,
    queryFn: () => {
      if (!uid || !sessionId) {
        throw new Error('Paramètres manquants')
      }
      return verifyCheckoutSession({ uid, sessionId })
    },
    enabled: Boolean(uid && sessionId),
    retry: 1,
  })
}

export const useWriteUserSubscriptionMutation = (uid: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { plan: SubscriptionPlan; status: SubscriptionStatus }) => writeUserSubscription(uid, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.user(uid) })
    },
  })
}
