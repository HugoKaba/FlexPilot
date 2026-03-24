import { z } from 'zod'
import { auth } from '@/shared/api'

const githubStatusSchema = z.object({
  connected: z.boolean(),
  login: z.string().optional(),
  avatarUrl: z.string().optional(),
  profileUrl: z.string().optional(),
  scope: z.string().optional(),
})

const githubRepoSchema = z.object({
  id: z.string(),
  name: z.string(),
  fullName: z.string(),
  private: z.boolean(),
  defaultBranch: z.string(),
  updatedAt: z.string(),
  url: z.string(),
})

const githubReposSchema = z.object({
  repos: z.array(githubRepoSchema),
})

const githubExchangeSchema = z.object({
  connected: z.boolean(),
  login: z.string().optional(),
  avatarUrl: z.string().optional(),
  profileUrl: z.string().optional(),
})

export type GithubStatus = z.infer<typeof githubStatusSchema>
export type GithubRepo = z.infer<typeof githubRepoSchema>

const postWorkspaceApi = async (path: string, payload: Record<string, string>): Promise<unknown> => {
  const user = auth.currentUser
  if (!user) {
    throw new Error('Utilisateur non connecté.')
  }

  const token = await user.getIdToken()
  const response = await fetch(`/api/workspace${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Erreur API GitHub.')
  }

  return response.json()
}

export const getGithubAuthorizeUrl = (state: string, redirectUri: string): string => {
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID
  if (!clientId || clientId.length < 4) {
    throw new Error('VITE_GITHUB_CLIENT_ID manquant.')
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'repo read:user',
    state,
    allow_signup: 'true',
  })

  return `https://github.com/login/oauth/authorize?${params.toString()}`
}

export const readGithubStatus = async (uid: string): Promise<GithubStatus> => {
  const data = await postWorkspaceApi('/github/status', { uid })
  return githubStatusSchema.parse(data)
}

export const exchangeGithubCode = async (payload: { uid: string; code: string; redirectUri: string }): Promise<GithubStatus> => {
  const data = await postWorkspaceApi('/github/exchange-code', payload)
  return githubExchangeSchema.parse(data)
}

export const readGithubRepos = async (uid: string): Promise<GithubRepo[]> => {
  const data = await postWorkspaceApi('/github/repos', { uid })
  return githubReposSchema.parse(data).repos
}

export const disconnectGithub = async (uid: string): Promise<void> => {
  await postWorkspaceApi('/github/disconnect', { uid })
}
