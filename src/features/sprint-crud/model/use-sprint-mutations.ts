import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSprint, deleteSprint, updateSprint, type SprintPayload } from '@/entities/sprint'
import { queryKeys } from '@/shared/lib'

export const useCreateSprintMutation = (userId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SprintPayload) => createSprint(userId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.sprints.list(userId) })
    },
  })
}

export const useUpdateSprintMutation = (userId: string, sprintId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SprintPayload) => updateSprint(userId, sprintId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.sprints.list(userId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.sprints.detail(userId, sprintId) }),
      ])
    },
  })
}

export const useDeleteSprintMutation = (userId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sprintId: string) => deleteSprint(userId, sprintId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.sprints.list(userId) })
    },
  })
}
