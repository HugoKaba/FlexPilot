import { useMutation, useQueryClient } from '@tanstack/react-query'
import { assignWorkItemSprint, moveWorkItemStatus, type WorkItemStatus } from '@/entities/work-item'
import { queryKeys } from '@/shared/lib'

export const useMoveWorkItemStatusMutation = (userId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ itemId, status }: { itemId: string; status: WorkItemStatus }) => moveWorkItemStatus(userId, itemId, status),
    onMutate: async ({ itemId, status }) => {
      const listKey = queryKeys.workItems.list(userId)
      const boardKey = queryKeys.workItems.board(userId)
      await Promise.all([
        queryClient.cancelQueries({ queryKey: listKey }),
        queryClient.cancelQueries({ queryKey: boardKey }),
      ])
      const previousList = queryClient.getQueryData(listKey)
      const previousBoard = queryClient.getQueryData(boardKey)

      const patchItems = (items: unknown) => {
        if (!Array.isArray(items)) {
          return items
        }

        return items.map((item) => {
          if (typeof item === 'object' && item !== null && 'id' in item && item.id === itemId) {
            return {
              ...item,
              status,
            }
          }

          return item
        })
      }

      queryClient.setQueryData(listKey, patchItems)
      queryClient.setQueryData(boardKey, patchItems)

      return { previousList, previousBoard }
    },
    onError: (_error, _variables, context) => {
      if (!context) return
      if (context.previousList) {
        queryClient.setQueryData(queryKeys.workItems.list(userId), context.previousList)
      }
      if (context.previousBoard) {
        queryClient.setQueryData(queryKeys.workItems.board(userId), context.previousBoard)
      }
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.workItems.list(userId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.workItems.board(userId) }),
      ])
    },
  })
}

export const useAssignWorkItemSprintMutation = (userId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ itemId, sprintId }: { itemId: string; sprintId: string | null }) =>
      assignWorkItemSprint(userId, itemId, sprintId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.workItems.list(userId) })
    },
  })
}
