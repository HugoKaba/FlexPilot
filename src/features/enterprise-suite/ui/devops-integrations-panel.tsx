import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import {
  getGithubAuthorizeUrl,
} from '@/features/enterprise-suite/api'
import {
  useDisconnectGithubMutation,
  useExchangeGithubCodeMutation,
  useGithubReposQuery,
  useGithubStatusQuery,
} from '@/features/enterprise-suite/model'
import { Button, Card } from '@/shared/ui'

export const DevopsIntegrationsPanel = () => {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const statusQuery = useGithubStatusQuery(user?.uid)
  const reposQuery = useGithubReposQuery(user?.uid, statusQuery.data?.connected === true)
  const exchangeMutation = useExchangeGithubCodeMutation(user?.uid)
  const disconnectMutation = useDisconnectGithubMutation(user?.uid)
  const [connectError, setConnectError] = useState<string | null>(null)

  const oauthParams = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return {
      code: params.get('code') ?? '',
      state: params.get('state') ?? '',
    }
  }, [location.search])
  const oauthStateError =
    oauthParams.code && oauthParams.state && user?.uid
      ? (sessionStorage.getItem('github_oauth_state') ?? '') !== oauthParams.state
        ? 'Etat OAuth invalide. Recommence la connexion GitHub.'
        : null
      : null

  useEffect(() => {
    if (!oauthParams.code || !oauthParams.state || !user?.uid) {
      return
    }
    if (oauthStateError) {
      return
    }

    const redirectUri = `${window.location.origin}/integrations`
    void exchangeMutation
      .mutateAsync({ code: oauthParams.code, redirectUri })
      .then(() => {
        setConnectError(null)
        sessionStorage.removeItem('github_oauth_state')
        navigate('/integrations', { replace: true })
      })
      .catch(() => {
        setConnectError('Connexion GitHub échouée.')
      })
  }, [exchangeMutation, navigate, oauthParams.code, oauthParams.state, oauthStateError, user?.uid])

  const startConnect = () => {
    try {
      const state = crypto.randomUUID()
      sessionStorage.setItem('github_oauth_state', state)
      const redirectUri = `${window.location.origin}/integrations`
      window.location.assign(getGithubAuthorizeUrl(state, redirectUri))
    } catch (error) {
      setConnectError(error instanceof Error ? error.message : 'Impossible de lancer OAuth GitHub.')
    }
  }

  return (
    <Card className="enterprise-card">
      <h2>DevOps Integrations</h2>
      <p className="page-subtitle">Connexion OAuth GitHub réelle + lecture des repos utilisateur.</p>

      <article className="enterprise-item">
        <div className="enterprise-row">
          <div>
            <p><strong>GitHub</strong></p>
            <p className="page-subtitle">
              {statusQuery.isLoading
                ? 'Chargement...'
                : statusQuery.data?.connected
                  ? `Compte connecté: ${statusQuery.data.login ?? 'inconnu'}`
                  : 'Aucun compte connecté'}
            </p>
          </div>
          <div className="actions">
            {statusQuery.data?.connected ? (
              <Button
                type="button"
                tone="danger"
                disabled={disconnectMutation.isPending}
                onClick={() => {
                  void disconnectMutation.mutateAsync()
                }}
              >
                {disconnectMutation.isPending ? 'Déconnexion...' : 'Disconnect'}
              </Button>
            ) : (
              <Button
                type="button"
                tone="primary"
                disabled={exchangeMutation.isPending}
                onClick={startConnect}
              >
                {exchangeMutation.isPending ? 'Connexion...' : 'Connect GitHub'}
              </Button>
            )}
          </div>
        </div>
        {oauthStateError ?? connectError ? <p className="error">{oauthStateError ?? connectError}</p> : null}
      </article>

      {statusQuery.data?.connected ? (
        <article className="enterprise-item">
          <div className="enterprise-row">
            <h3>Repositories</h3>
            <Button
              type="button"
              tone="muted"
              onClick={() => {
                void reposQuery.refetch()
              }}
            >
              Refresh
            </Button>
          </div>
          {reposQuery.isLoading ? <p className="page-subtitle">Chargement des repos...</p> : null}
          {reposQuery.isError ? <p className="error">Impossible de charger les repos.</p> : null}
          <div className="enterprise-list">
            {(reposQuery.data ?? []).slice(0, 12).map((repo) => (
              <article key={repo.id} className="enterprise-item enterprise-row">
                <div>
                  <p><strong>{repo.fullName}</strong></p>
                  <p className="page-subtitle">Branch: {repo.defaultBranch} · {repo.private ? 'Private' : 'Public'}</p>
                </div>
                <a className="btn btn-muted" href={repo.url} target="_blank" rel="noreferrer">
                  Open
                </a>
              </article>
            ))}
          </div>
        </article>
      ) : null}
    </Card>
  )
}
