import { z } from 'zod'

export const invitationStatusSchema = z.enum(['pending', 'accepted', 'revoked'])

export const invitationSchema = z.object({
  id: z.string(),
  ownerUserId: z.string(),
  ownerEmail: z.string().email(),
  inviteeEmail: z.string().email(),
  token: z.string().min(6),
  status: invitationStatusSchema,
  acceptedByUserId: z.string().nullable(),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
})

export const invitationPayloadSchema = z.object({
  ownerUserId: z.string().min(1),
  ownerEmail: z.string().email(),
  inviteeEmail: z.string().email('Email invité invalide'),
})

export type Invitation = z.infer<typeof invitationSchema>
export type InvitationPayload = z.infer<typeof invitationPayloadSchema>
export type InvitationStatus = z.infer<typeof invitationStatusSchema>
