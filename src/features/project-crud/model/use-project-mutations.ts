import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProject, removeProject, updateProject, type ProjectPayload } from '@/entities/project'
import { queryKeys } from '@/shared/lib'

export const useCreateProjectMutation = (userId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ProjectPayload) => createProject(userId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.projects.list(userId) })
    },
  })
}

export const useUpdateProjectMutation = (userId: string, projectId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ProjectPayload) => updateProject(userId, projectId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.projects.list(userId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(userId, projectId) }),
      ])
    },
  })
}

export const useDeleteProjectMutation = (userId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (projectId: string) => removeProject(userId, projectId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.projects.list(userId) })
    },
  })
}
