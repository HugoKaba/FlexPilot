import { z } from 'zod'

export const projectFiltersSchema = z.object({
  search: z.string(),
  status: z.enum(['all', 'planned', 'in_progress', 'done']),
})

export type ProjectFilters = z.infer<typeof projectFiltersSchema>
