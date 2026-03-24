import { useQuery } from '@tanstack/react-query'
import { listOwnedInvitations } from '@/entities/invitation/api/invitation-service'

export const useOwnedInvitationsQuery = (ownerUserId: string | undefined) => {
  return useQuery({
    queryKey: ownerUserId ? ['invitations', 'owner', ownerUserId] : ['invitations'],
    queryFn: () => {
      if (!ownerUserId) {
        throw new Error('ownerUserId manquant')
      }
      return listOwnedInvitations(ownerUserId)
    },
    enabled: Boolean(ownerUserId),
  })
}
