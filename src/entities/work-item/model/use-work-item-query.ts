import { useQuery } from '@tanstack/react-query'
import { getWorkItemById, listWorkItems } from '@/entities/work-item/api/work-item-service'
import { queryKeys } from '@/shared/lib'

export const useWorkItemsQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: userId ? queryKeys.workItems.list(userId) : queryKeys.workItems.all,
    queryFn: () => {
      if (!userId) {
        throw new Error('userId manquant')
      }
      return listWorkItems(userId)
    },
    enabled: Boolean(userId),
  })
}

export const useWorkItemQuery = (userId: string | undefined, itemId: string | undefined) => {
  return useQuery({
    queryKey: userId && itemId ? queryKeys.workItems.detail(userId, itemId) : queryKeys.workItems.all,
    queryFn: () => {
      if (!userId || !itemId) {
        throw new Error('Paramètres manquants')
      }

      return getWorkItemById(userId, itemId)
    },
    enabled: Boolean(userId && itemId),
  })
}

export const useBoardColumnsQuery = (userId: string | undefined) => {
  return useQuery({
    queryKey: userId ? queryKeys.workItems.board(userId) : queryKeys.workItems.all,
    queryFn: () => {
      if (!userId) {
        throw new Error('userId manquant')
      }

      return listWorkItems(userId)
    },
    enabled: Boolean(userId),
    select: (items) => ({
      todo: items.filter((item) => item.status === 'todo'),
      in_progress: items.filter((item) => item.status === 'in_progress'),
      review: items.filter((item) => item.status === 'review'),
      done: items.filter((item) => item.status === 'done'),
    }),
  })
}
