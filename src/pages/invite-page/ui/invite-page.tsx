import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { acceptInvitationByToken } from '@/entities/invitation'
import { useAuth } from '@/features/auth'
import { Button, Card, ErrorState } from '@/shared/ui'

export const InvitePage = () => {
  const { token } = useParams<{ token: string }>()
  const { user } = useAuth()

  const canAccept = useMemo(() => Boolean(user?.uid && user?.email && token), [token, user?.email, user?.uid])

  const acceptMutation = useMutation({
    mutationFn: async () => {
      if (!user?.uid || !user.email || !token) {
        throw new Error('Session invalide')
      }

      await acceptInvitationByToken(token, user.uid, user.email)
    },
  })

  if (!token) {
    return <ErrorState title="Token d’invitation manquant." />
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return (
    <section className="page">
      <div className="page-head">
        <h1>Invitation d’équipe</h1>
        <p className="page-subtitle">Accepte cette invitation pour rejoindre l’espace collaboratif.</p>
      </div>

      <Card className="team-invite-card">
        <p>Token: <strong>{token}</strong></p>
        <Button type="button" tone="primary" disabled={!canAccept || acceptMutation.isPending} onClick={() => void acceptMutation.mutateAsync()}>
          {acceptMutation.isPending ? 'Validation...' : 'Accepter l’invitation'}
        </Button>
        {acceptMutation.isSuccess ? <p className="page-subtitle">Invitation acceptée.</p> : null}
        {acceptMutation.isError ? <p className="error">{acceptMutation.error.message}</p> : null}
      </Card>
    </section>
  )
}
