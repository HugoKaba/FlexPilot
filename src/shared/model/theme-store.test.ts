import { describe, expect, it } from 'vitest'
import { useThemeStore } from '@/shared/model/theme-store'

describe('theme store', () => {
  it('set mode and resolves deterministic theme', () => {
    useThemeStore.setState({ mode: 'light' })
    expect(useThemeStore.getState().resolvedTheme()).toBe('light')

    useThemeStore.getState().setMode('dark')
    expect(useThemeStore.getState().resolvedTheme()).toBe('dark')
  })
})
