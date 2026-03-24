import { z } from 'zod'

export const workItemFiltersSchema = z.object({
  q: z.string(),
  type: z.enum(['all', 'epic', 'feature', 'story', 'task', 'bug']),
  status: z.enum(['all', 'todo', 'in_progress', 'review', 'done']),
  priority: z.enum(['all', 'low', 'medium', 'high', 'critical']),
  assignee: z.string(),
  sprintId: z.string(),
})

export type WorkItemFilters = z.infer<typeof workItemFiltersSchema>
