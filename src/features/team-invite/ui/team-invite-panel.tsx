import { useMemo, useState } from 'react'
import { useOwnedInvitationsQuery } from '@/entities/invitation'
import { useCreateInvitationMutation } from '@/features/team-invite/model/use-invite-mutations'
import { useAuth } from '@/features/auth'
import { usePreferencesStore } from '@/shared/model'
import { Button, Card, EmptyState, FieldInput } from '@/shared/ui'

export const TeamInvitePanel = () => {
  const { user } = useAuth()
  const subscriptionStatus = usePreferencesStore((state) => state.subscriptionStatus)
  const invitationsQuery = useOwnedInvitationsQuery(user?.uid)
  const createInvitationMutation = useCreateInvitationMutation()
  const [inviteeEmail, setInviteeEmail] = useState('')
  const [copyMessage, setCopyMessage] = useState<string | null>(null)

  const canInvite = subscriptionStatus === 'active'

  const pendingCount = useMemo(() => {
    if (!invitationsQuery.data) {
      return 0
    }
    return invitationsQuery.data.filter((invitation) => invitation.status === 'pending').length
  }, [invitationsQuery.data])

  const handleInvite = async () => {
    setCopyMessage(null)
    await createInvitationMutation.mutateAsync(inviteeEmail)
    setInviteeEmail('')
  }

  return (
    <section className="page">
      <Card className="team-invite-card">
        <h2>Inviter des membres</h2>
        <p className="page-subtitle">Fonction réservée aux comptes avec abonnement actif. Invitations en attente: {pendingCount}</p>

        <div className="actions">
          <label className="field invite-input">
            Email à inviter
            <FieldInput
              type="email"
              value={inviteeEmail}
              onChange={(event) => setInviteeEmail(event.target.value)}
              placeholder="membre@team.com"
              disabled={!canInvite || createInvitationMutation.isPending}
            />
          </label>
          <Button
            type="button"
            tone="primary"
            disabled={!canInvite || !inviteeEmail || createInvitationMutation.isPending}
            onClick={() => void handleInvite()}
          >
            {createInvitationMutation.isPending ? 'Invitation...' : 'Envoyer invitation'}
          </Button>
        </div>

        {!canInvite ? <p className="error">Tu dois avoir un abonnement actif pour inviter des membres.</p> : null}
        {createInvitationMutation.isError ? <p className="error">{createInvitationMutation.error.message}</p> : null}
      </Card>

      <Card>
        <h2>Liens d’invitation</h2>
        {!invitationsQuery.data?.length ? (
          <EmptyState title="Aucune invitation pour le moment." />
        ) : (
          <div className="invite-list">
            {invitationsQuery.data.map((invitation) => {
              const inviteLink = `${window.location.origin}/invite/${invitation.token}`

              return (
                <article key={invitation.id} className="invite-item">
                  <div>
                    <p><strong>{invitation.inviteeEmail}</strong></p>
                    <p className="page-subtitle">Statut: {invitation.status}</p>
                  </div>
                  <Button
                    type="button"
                    tone="muted"
                    onClick={async () => {
                      await navigator.clipboard.writeText(inviteLink)
                      setCopyMessage(`Lien copié pour ${invitation.inviteeEmail}`)
                    }}
                  >
                    Copier le lien
                  </Button>
                </article>
              )
            })}
          </div>
        )}
        {copyMessage ? <p className="page-subtitle">{copyMessage}</p> : null}
      </Card>
    </section>
  )
}
