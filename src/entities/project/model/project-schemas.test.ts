import { describe, expect, it } from 'vitest'
import { projectPayloadSchema, projectSchema } from '@/entities/project/model/project-schemas'

describe('project schemas', () => {
  it('parse une réponse API valide avec projectSchema.parse', () => {
    const parsed = projectSchema.parse({
      id: 'p1',
      userId: 'u1',
      title: 'Roadmap SaaS',
      description: 'Plan de lancement',
      status: 'planned',
      budget: 1200,
      favorite: false,
      createdAt: 1711111111111,
    })

    expect(parsed.title).toBe('Roadmap SaaS')
  })

  it('rejette un payload de formulaire invalide', () => {
    const result = projectPayloadSchema.safeParse({
      title: 'ok',
      description: 'court',
      status: 'planned',
      budget: -10,
    })

    expect(result.success).toBe(false)
  })
})
