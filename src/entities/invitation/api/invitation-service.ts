import { addDoc, collection, doc, getDocs, limit, query, updateDoc, where } from 'firebase/firestore'
import { db } from '@/shared/api'
import { invitationSchema, type Invitation, type InvitationPayload } from '@/entities/invitation/model/invitation-schemas'

const invitationsCollection = collection(db, 'invitations')

const parseInvitation = (input: unknown): Invitation => invitationSchema.parse(input)

const createToken = (): string => {
  const randomPart = Math.random().toString(36).slice(2, 10)
  return `inv_${Date.now().toString(36)}_${randomPart}`
}

export const listOwnedInvitations = async (ownerUserId: string): Promise<Invitation[]> => {
  const invitationsQuery = query(invitationsCollection, where('ownerUserId', '==', ownerUserId))
  const snapshot = await getDocs(invitationsQuery)

  return snapshot.docs
    .map((invitationDoc) =>
      parseInvitation({
        id: invitationDoc.id,
        ...invitationDoc.data(),
      }),
    )
    .sort((a, b) => b.createdAt - a.createdAt)
}

export const createInvitation = async (payload: InvitationPayload): Promise<void> => {
  await addDoc(invitationsCollection, {
    ...payload,
    token: createToken(),
    status: 'pending',
    acceptedByUserId: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })
}

export const acceptInvitationByToken = async (token: string, userId: string, userEmail: string): Promise<void> => {
  const invitationQuery = query(invitationsCollection, where('token', '==', token), limit(1))
  const snapshot = await getDocs(invitationQuery)

  if (snapshot.empty) {
    throw new Error('Invitation introuvable')
  }

  const invitationDoc = snapshot.docs[0]
  const invitation = parseInvitation({
    id: invitationDoc.id,
    ...invitationDoc.data(),
  })

  if (invitation.status !== 'pending') {
    throw new Error('Cette invitation n’est plus valide')
  }

  if (invitation.inviteeEmail.toLowerCase() !== userEmail.toLowerCase()) {
    throw new Error('Cette invitation est liée à un autre email')
  }

  await updateDoc(doc(db, 'invitations', invitation.id), {
    status: 'accepted',
    acceptedByUserId: userId,
    updatedAt: Date.now(),
  })
}
