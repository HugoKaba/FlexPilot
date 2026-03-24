import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { db } from '@/shared/api'
import { workItemSchema, type WorkItem, type WorkItemPayload, type WorkItemStatus } from '@/entities/work-item/model/work-item-schemas'

const workItemsCollection = collection(db, 'workItems')

const parseWorkItem = (input: unknown): WorkItem => workItemSchema.parse(input)

export const listWorkItems = async (userId: string): Promise<WorkItem[]> => {
  const itemsQuery = query(workItemsCollection, where('userId', '==', userId))
  const snapshot = await getDocs(itemsQuery)

  return snapshot.docs
    .map((itemDoc) =>
      parseWorkItem({
        id: itemDoc.id,
        ...itemDoc.data(),
      }),
    )
    .sort((a, b) => a.rank - b.rank)
}

export const getWorkItemById = async (userId: string, itemId: string): Promise<WorkItem> => {
  const snapshot = await getDoc(doc(db, 'workItems', itemId))

  if (!snapshot.exists()) {
    throw new Error('Work item introuvable')
  }

  const parsed = parseWorkItem({
    id: snapshot.id,
    ...snapshot.data(),
  })

  if (parsed.userId !== userId) {
    throw new Error('Accès non autorisé')
  }

  return parsed
}

export const createWorkItem = async (userId: string, payload: WorkItemPayload): Promise<void> => {
  const currentItems = await listWorkItems(userId)

  await addDoc(workItemsCollection, {
    ...payload,
    userId,
    rank: currentItems.length,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })
}

export const updateWorkItem = async (userId: string, itemId: string, payload: WorkItemPayload): Promise<void> => {
  const target = await getWorkItemById(userId, itemId)

  await updateDoc(doc(db, 'workItems', target.id), {
    ...payload,
    updatedAt: Date.now(),
  })
}

export const deleteWorkItem = async (userId: string, itemId: string): Promise<void> => {
  const target = await getWorkItemById(userId, itemId)
  await deleteDoc(doc(db, 'workItems', target.id))
}

export const moveWorkItemStatus = async (userId: string, itemId: string, status: WorkItemStatus): Promise<void> => {
  const target = await getWorkItemById(userId, itemId)

  await updateDoc(doc(db, 'workItems', target.id), {
    status,
    updatedAt: Date.now(),
  })
}

export const assignWorkItemSprint = async (userId: string, itemId: string, sprintId: string | null): Promise<void> => {
  const target = await getWorkItemById(userId, itemId)

  await updateDoc(doc(db, 'workItems', target.id), {
    sprintId,
    updatedAt: Date.now(),
  })
}

export const moveWorkItemRank = async (userId: string, itemId: string, direction: 'up' | 'down'): Promise<void> => {
  const items = await listWorkItems(userId)
  const index = items.findIndex((item) => item.id === itemId)

  if (index < 0) {
    return
  }

  const neighborIndex = direction === 'up' ? index - 1 : index + 1

  if (neighborIndex < 0 || neighborIndex >= items.length) {
    return
  }

  const current = items[index]
  const neighbor = items[neighborIndex]

  await Promise.all([
    updateDoc(doc(db, 'workItems', current.id), {
      rank: neighbor.rank,
      updatedAt: Date.now(),
    }),
    updateDoc(doc(db, 'workItems', neighbor.id), {
      rank: current.rank,
      updatedAt: Date.now(),
    }),
  ])
}
