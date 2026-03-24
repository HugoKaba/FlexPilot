import { describe, expect, it } from 'vitest'
import { workItemPayloadSchema, workItemSchema } from '@/entities/work-item/model/work-item-schemas'

describe('work item schemas', () => {
  it('parse un work item valide', () => {
    const parsed = workItemSchema.parse({
      id: 'w1',
      userId: 'u1',
      title: 'Story checkout',
      description: 'Implémenter la page de checkout',
      type: 'story',
      status: 'todo',
      priority: 'high',
      estimate: 5,
      assignee: 'Hugo',
      labels: ['frontend'],
      sprintId: null,
      parentId: null,
      rank: 0,
      createdAt: 1,
      updatedAt: 1,
    })

    expect(parsed.type).toBe('story')
  })

  it('rejette un payload invalide', () => {
    const result = workItemPayloadSchema.safeParse({
      title: 'ab',
      description: '',
      type: 'task',
      status: 'todo',
      priority: 'low',
      estimate: -1,
      assignee: '',
      labels: [],
      sprintId: null,
      parentId: null,
    })

    expect(result.success).toBe(false)
  })
})
