import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { WorkItemFiltersPanel } from '@/features/work-item-filters/ui/work-item-filters'

describe('WorkItemFiltersPanel', () => {
  it('change le filtre statut', async () => {
    const onChange = vi.fn()

    render(
      <WorkItemFiltersPanel
        values={{ q: '', type: 'all', status: 'all', priority: 'all', assignee: '', sprintId: '' }}
        sprints={[]}
        onChange={onChange}
      />,
    )

    await userEvent.selectOptions(screen.getByLabelText('Statut'), 'done')

    expect(onChange).toHaveBeenCalledWith({
      q: '',
      type: 'all',
      status: 'done',
      priority: 'all',
      assignee: '',
      sprintId: '',
    })
  })
})
