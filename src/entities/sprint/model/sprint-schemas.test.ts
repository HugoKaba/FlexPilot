import { describe, expect, it } from 'vitest'
import { sprintPayloadSchema, sprintSchema } from '@/entities/sprint/model/sprint-schemas'

describe('sprint schemas', () => {
  it('parse un sprint valide', () => {
    const parsed = sprintSchema.parse({
      id: 's1',
      userId: 'u1',
      name: 'Sprint 1',
      goal: 'Livrer backlog MVP',
      startDate: '2026-03-01',
      endDate: '2026-03-14',
      status: 'active',
      createdAt: 1,
      updatedAt: 1,
    })

    expect(parsed.status).toBe('active')
  })

  it('rejette un payload invalide', () => {
    const result = sprintPayloadSchema.safeParse({
      name: 'a',
      goal: '',
      startDate: '',
      endDate: '',
      status: 'planned',
    })

    expect(result.success).toBe(false)
  })
})
