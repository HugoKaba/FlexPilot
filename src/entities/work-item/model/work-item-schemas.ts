import { z } from 'zod'

export const workItemTypeSchema = z.enum(['epic', 'feature', 'story', 'task', 'bug'])
export const workItemStatusSchema = z.enum(['todo', 'in_progress', 'review', 'done'])
export const workItemPrioritySchema = z.enum(['low', 'medium', 'high', 'critical'])

export const workItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  type: workItemTypeSchema,
  status: workItemStatusSchema,
  priority: workItemPrioritySchema,
  estimate: z.number().nonnegative(),
  assignee: z.string().min(1),
  labels: z.array(z.string()),
  sprintId: z.string().nullable(),
  parentId: z.string().nullable(),
  rank: z.number().int().nonnegative(),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
})

export const workItemPayloadSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().min(5, 'Description trop courte'),
  type: workItemTypeSchema,
  status: workItemStatusSchema,
  priority: workItemPrioritySchema,
  estimate: z.number().nonnegative('Estimation invalide'),
  assignee: z.string().min(1, 'Assignee requis'),
  labels: z.array(z.string()),
  sprintId: z.string().nullable(),
  parentId: z.string().nullable(),
})

export type WorkItem = z.infer<typeof workItemSchema>
export type WorkItemPayload = z.infer<typeof workItemPayloadSchema>
export type WorkItemStatus = z.infer<typeof workItemStatusSchema>
export type WorkItemType = z.infer<typeof workItemTypeSchema>
export type WorkItemPriority = z.infer<typeof workItemPrioritySchema>
