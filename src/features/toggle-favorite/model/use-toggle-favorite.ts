import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toggleProjectFavorite } from '@/entities/project'
import { queryKeys } from '@/shared/lib'

export const useToggleFavoriteMutation = (userId: string, projectId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => toggleProjectFavorite(userId, projectId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.projects.list(userId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(userId, projectId) }),
      ])
    },
  })
}
