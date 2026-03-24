import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createInvitation } from '@/entities/invitation'
import { useAuth } from '@/features/auth'

export const useCreateInvitationMutation = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (inviteeEmail: string) => {
      if (!user?.uid || !user.email) {
        throw new Error('Session invalide')
      }

      await createInvitation({
        ownerUserId: user.uid,
        ownerEmail: user.email,
        inviteeEmail,
      })
    },
    onSuccess: async () => {
      if (user?.uid) {
        await queryClient.invalidateQueries({ queryKey: ['invitations', 'owner', user.uid] })
      }
    },
  })
}
