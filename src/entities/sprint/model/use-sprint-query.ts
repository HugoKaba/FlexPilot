import { useQuery } from '@tanstack/react-query'
import { getSprintById, listSprints } from '@/entities/sprint/api/sprint-service'
import { queryKeys } from '@/shared/lib'

export const useSprintsQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: userId ? queryKeys.sprints.list(userId) : queryKeys.sprints.all,
    queryFn: () => {
      if (!userId) {
        throw new Error('userId manquant')
      }

      return listSprints(userId)
    },
    enabled: Boolean(userId),
  })
}

export const useSprintQuery = (userId: string | undefined, sprintId: string | undefined) => {
  return useQuery({
    queryKey: userId && sprintId ? queryKeys.sprints.detail(userId, sprintId) : queryKeys.sprints.all,
    queryFn: () => {
      if (!userId || !sprintId) {
        throw new Error('Paramètres manquants')
      }

      return getSprintById(userId, sprintId)
    },
    enabled: Boolean(userId && sprintId),
  })
}
