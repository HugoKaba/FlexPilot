import { useQuery } from '@tanstack/react-query'
import { getProjectById, listProjects } from '@/entities/project/api/project-service'
import { queryKeys } from '@/shared/lib'

export const useProjectsQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: userId ? queryKeys.projects.list(userId) : queryKeys.projects.all,
    queryFn: () => {
      if (!userId) {
        throw new Error('userId manquant')
      }
      return listProjects(userId)
    },
    enabled: Boolean(userId),
  })
}

export const useProjectQuery = (userId: string | undefined, projectId: string | undefined) => {
  return useQuery({
    queryKey: userId && projectId ? queryKeys.projects.detail(userId, projectId) : queryKeys.projects.all,
    queryFn: () => {
      if (!userId || !projectId) {
        throw new Error('Paramètres manquants')
      }
      return getProjectById(userId, projectId)
    },
    enabled: Boolean(userId && projectId),
  })
}
