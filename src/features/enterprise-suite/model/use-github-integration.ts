import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { disconnectGithub, exchangeGithubCode, readGithubRepos, readGithubStatus } from '@/features/enterprise-suite/api'
import { queryKeys } from '@/shared/lib'

export const useGithubStatusQuery = (uid: string | undefined) => {
  return useQuery({
    queryKey: uid ? queryKeys.github.status(uid) : queryKeys.github.all,
    queryFn: () => {
      if (!uid) {
        throw new Error('uid manquant')
      }
      return readGithubStatus(uid)
    },
    enabled: Boolean(uid),
  })
}

export const useGithubReposQuery = (uid: string | undefined, enabled: boolean) => {
  return useQuery({
    queryKey: uid ? queryKeys.github.repos(uid) : queryKeys.github.all,
    queryFn: () => {
      if (!uid) {
        throw new Error('uid manquant')
      }
      return readGithubRepos(uid)
    },
    enabled: Boolean(uid && enabled),
  })
}

export const useExchangeGithubCodeMutation = (uid: string | undefined) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ code, redirectUri }: { code: string; redirectUri: string }) => {
      if (!uid) {
        throw new Error('uid manquant')
      }
      return exchangeGithubCode({ uid, code, redirectUri })
    },
    onSuccess: async () => {
      if (!uid) {
        return
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.github.status(uid) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.github.repos(uid) }),
      ])
    },
  })
}

export const useDisconnectGithubMutation = (uid: string | undefined) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      if (!uid) {
        throw new Error('uid manquant')
      }
      await disconnectGithub(uid)
    },
    onSuccess: async () => {
      if (!uid) {
        return
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.github.status(uid) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.github.repos(uid) }),
      ])
    },
  })
}
