import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MoveStatusButtons } from '@/features/board-actions/ui/move-status-buttons'

describe('MoveStatusButtons', () => {
  it('propose la transition depuis todo et déclenche le callback', async () => {
    const onMove = vi.fn()

    render(<MoveStatusButtons current="todo" onMove={onMove} />)

    await userEvent.click(screen.getByRole('button', { name: /in progress/i }))

    expect(onMove).toHaveBeenCalledWith('in_progress')
  })
})
