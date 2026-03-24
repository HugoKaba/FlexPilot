import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore'
import { db } from '@/shared/api'
import { projectSchema, type Project, type ProjectPayload } from '@/entities/project/model/project-schemas'

const projectsCollection = collection(db, 'projects')

const parseProject = (input: unknown): Project => projectSchema.parse(input)

export const listProjects = async (userId: string): Promise<Project[]> => {
  const projectsQuery = query(
    projectsCollection,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  )

  const snapshot = await getDocs(projectsQuery)

  return snapshot.docs.map((projectDoc) =>
    parseProject({
      id: projectDoc.id,
      ...projectDoc.data(),
    }),
  )
}

export const getProjectById = async (userId: string, projectId: string): Promise<Project> => {
  const snapshot = await getDoc(doc(db, 'projects', projectId))

  if (!snapshot.exists()) {
    throw new Error('Projet introuvable')
  }

  const parsed = parseProject({
    id: snapshot.id,
    ...snapshot.data(),
  })

  if (parsed.userId !== userId) {
    throw new Error('Accès non autorisé')
  }

  return parsed
}

export const createProject = async (userId: string, payload: ProjectPayload): Promise<void> => {
  await addDoc(projectsCollection, {
    ...payload,
    userId,
    favorite: false,
    createdAt: Date.now(),
  })
}

export const updateProject = async (userId: string, projectId: string, payload: ProjectPayload): Promise<void> => {
  const target = await getProjectById(userId, projectId)

  await updateDoc(doc(db, 'projects', target.id), {
    ...payload,
  })
}

export const removeProject = async (userId: string, projectId: string): Promise<void> => {
  const target = await getProjectById(userId, projectId)
  await deleteDoc(doc(db, 'projects', target.id))
}

export const toggleProjectFavorite = async (userId: string, projectId: string): Promise<void> => {
  const target = await getProjectById(userId, projectId)

  await updateDoc(doc(db, 'projects', target.id), {
    favorite: !target.favorite,
  })
}
