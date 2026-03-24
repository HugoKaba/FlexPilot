import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ProjectFiltersPanel } from '@/features/project-filters/ui/project-filters'

describe('ProjectFiltersPanel', () => {
  it('rend le formulaire et déclenche onChange lors d\'une interaction', async () => {
    const onChange = vi.fn()

    render(
      <ProjectFiltersPanel
        values={{ search: '', status: 'all' }}
        onChange={onChange}
      />,
    )

    await userEvent.selectOptions(screen.getByLabelText('Statut'), 'done')

    expect(onChange).toHaveBeenCalledWith({ search: '', status: 'done' })
  })
})
