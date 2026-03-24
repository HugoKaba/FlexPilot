import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { SprintDetailPage } from '@/pages/sprint-detail-page/ui/sprint-detail-page'

const mutateAsync = vi.fn(async () => undefined)

vi.mock('@/features/auth', () => ({
  useAuth: () => ({ user: { uid: 'u1', email: 'test@test.dev' } }),
}))

vi.mock('@/entities/sprint', () => ({
  useSprintQuery: () => ({
    isLoading: false,
    isError: false,
    data: {
      id: 's1',
      userId: 'u1',
      name: 'Sprint 1',
      goal: 'Goal',
      startDate: '2026-03-01',
      endDate: '2026-03-14',
      status: 'active',
      createdAt: 1,
      updatedAt: 1,
    },
  }),
  useSprintsQuery: () => ({ isLoading: false, isError: false, data: [] }),
}))

vi.mock('@/entities/work-item', () => ({
  useWorkItemsQuery: () => ({
    isLoading: false,
    isError: false,
    data: [
      {
        id: 'w1',
        userId: 'u1',
        title: 'Item backlog',
        description: 'desc',
        type: 'task',
        status: 'todo',
        priority: 'medium',
        estimate: 3,
        assignee: 'Hugo',
        labels: [],
        sprintId: null,
        parentId: null,
        rank: 0,
        createdAt: 1,
        updatedAt: 1,
      },
    ],
  }),
}))

vi.mock('@/features/board-actions', () => ({
  useAssignWorkItemSprintMutation: () => ({ mutateAsync }),
}))

describe('SprintDetailPage', () => {
  it('assigne un item backlog au sprint', async () => {
    render(
      <MemoryRouter initialEntries={['/sprints/s1']}>
        <Routes>
          <Route path="/sprints/:sprintId" element={<SprintDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    await userEvent.click(screen.getByRole('button', { name: /ajouter/i }))

    expect(mutateAsync).toHaveBeenCalledWith({ itemId: 'w1', sprintId: 's1' })
  })
})
