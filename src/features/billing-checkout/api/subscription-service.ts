import { z } from 'zod'

const createSessionResponseSchema = z.object({
  clientSecret: z.string().min(1),
  sessionId: z.string().min(1),
})

const verifySessionResponseSchema = z.object({
  status: z.enum(['active', 'inactive']),
  plan: z.enum(['free', 'pro', 'business']),
})

const getApiBaseUrl = (): string => {
  const configured = import.meta.env.VITE_STRIPE_API_BASE_URL
  return configured && configured.length > 0 ? configured : '/api/stripe'
}

const postJson = async (path: string, body: Record<string, string>): Promise<unknown> => {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error('Service de paiement indisponible.')
  }

  return response.json()
}

export const createEmbeddedCheckoutSession = async (payload: { uid: string; email?: string }): Promise<{ clientSecret: string; sessionId: string }> => {
  const data = await postJson('/create-checkout-session', {
    uid: payload.uid,
    email: payload.email ?? '',
  })

  return createSessionResponseSchema.parse(data)
}

export const verifyCheckoutSession = async (payload: { uid: string; sessionId: string }): Promise<{ status: 'active' | 'inactive'; plan: 'free' | 'pro' | 'business' }> => {
  const data = await postJson('/verify-session', {
    uid: payload.uid,
    sessionId: payload.sessionId,
  })

  return verifySessionResponseSchema.parse(data)
}
