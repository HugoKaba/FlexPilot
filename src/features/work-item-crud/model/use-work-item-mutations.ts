import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createWorkItem, deleteWorkItem, moveWorkItemRank, updateWorkItem, type WorkItemPayload } from '@/entities/work-item'
import { queryKeys } from '@/shared/lib'

export const useCreateWorkItemMutation = (userId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: WorkItemPayload) => createWorkItem(userId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.workItems.list(userId) })
    },
  })
}

export const useUpdateWorkItemMutation = (userId: string, itemId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: WorkItemPayload) => updateWorkItem(userId, itemId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.workItems.list(userId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.workItems.detail(userId, itemId) }),
      ])
    },
  })
}

export const useDeleteWorkItemMutation = (userId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: string) => deleteWorkItem(userId, itemId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.workItems.list(userId) })
    },
  })
}

export const useMoveWorkItemRankMutation = (userId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ itemId, direction }: { itemId: string; direction: 'up' | 'down' }) =>
      moveWorkItemRank(userId, itemId, direction),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.workItems.list(userId) })
    },
  })
}
