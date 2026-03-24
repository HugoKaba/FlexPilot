import { z } from 'zod'

export const projectStatusSchema = z.enum(['planned', 'in_progress', 'done'])

export const projectSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  status: projectStatusSchema,
  budget: z.number().nonnegative(),
  favorite: z.boolean(),
  createdAt: z.number().int().nonnegative(),
})

export const projectPayloadSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  status: projectStatusSchema,
  budget: z.number().nonnegative('Le budget doit être positif'),
})

export type Project = z.infer<typeof projectSchema>
export type ProjectPayload = z.infer<typeof projectPayloadSchema>
