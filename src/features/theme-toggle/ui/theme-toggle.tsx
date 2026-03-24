import { useThemeStore, type ThemeMode } from '@/shared/model'
import { FieldSelect } from '@/shared/ui'

export const ThemeToggle = () => {
  const mode = useThemeStore((state) => state.mode)
  const setMode = useThemeStore((state) => state.setMode)

  return (
    <label className="theme-toggle">
      Theme
      <FieldSelect value={mode} onChange={(event) => setMode(event.target.value as ThemeMode)}>
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </FieldSelect>
    </label>
  )
}
