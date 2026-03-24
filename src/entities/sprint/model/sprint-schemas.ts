import { z } from 'zod'

export const sprintStatusSchema = z.enum(['planned', 'active', 'closed'])

export const sprintSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(1),
  goal: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  status: sprintStatusSchema,
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
})

export const sprintPayloadSchema = z.object({
  name: z.string().min(3, 'Nom trop court'),
  goal: z.string().min(3, 'Objectif trop court'),
  startDate: z.string().min(1, 'Date de début requise'),
  endDate: z.string().min(1, 'Date de fin requise'),
  status: sprintStatusSchema,
})

export type Sprint = z.infer<typeof sprintSchema>
export type SprintPayload = z.infer<typeof sprintPayloadSchema>
export type SprintStatus = z.infer<typeof sprintStatusSchema>
