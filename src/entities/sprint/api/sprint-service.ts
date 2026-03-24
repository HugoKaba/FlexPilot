import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { db } from '@/shared/api'
import { sprintSchema, type Sprint, type SprintPayload } from '@/entities/sprint/model/sprint-schemas'

const sprintsCollection = collection(db, 'sprints')

const parseSprint = (input: unknown): Sprint => sprintSchema.parse(input)

export const listSprints = async (userId: string): Promise<Sprint[]> => {
  const sprintsQuery = query(sprintsCollection, where('userId', '==', userId))
  const snapshot = await getDocs(sprintsQuery)

  return snapshot.docs
    .map((sprintDoc) =>
      parseSprint({
        id: sprintDoc.id,
        ...sprintDoc.data(),
      }),
    )
    .sort((a, b) => b.createdAt - a.createdAt)
}

export const getSprintById = async (userId: string, sprintId: string): Promise<Sprint> => {
  const snapshot = await getDoc(doc(db, 'sprints', sprintId))

  if (!snapshot.exists()) {
    throw new Error('Sprint introuvable')
  }

  const parsed = parseSprint({
    id: snapshot.id,
    ...snapshot.data(),
  })

  if (parsed.userId !== userId) {
    throw new Error('Accès non autorisé')
  }

  return parsed
}

export const createSprint = async (userId: string, payload: SprintPayload): Promise<void> => {
  await addDoc(sprintsCollection, {
    ...payload,
    userId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })
}

export const updateSprint = async (userId: string, sprintId: string, payload: SprintPayload): Promise<void> => {
  const target = await getSprintById(userId, sprintId)

  await updateDoc(doc(db, 'sprints', target.id), {
    ...payload,
    updatedAt: Date.now(),
  })
}

export const deleteSprint = async (userId: string, sprintId: string): Promise<void> => {
  const target = await getSprintById(userId, sprintId)
  await deleteDoc(doc(db, 'sprints', target.id))
}
