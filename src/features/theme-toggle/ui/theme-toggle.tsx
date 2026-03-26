import { useI18n } from '@/shared/lib'
import { useThemeStore, type ThemeMode } from '@/shared/model'
import { FieldSelect } from '@/shared/ui'

export const ThemeToggle = () => {
  const { t } = useI18n()
  const mode = useThemeStore((state) => state.mode)
  const setMode = useThemeStore((state) => state.setMode)

  return (
    <label className="theme-toggle">
      {t('theme')}
      <FieldSelect value={mode} onChange={(event) => setMode(event.target.value as ThemeMode)}>
        <option value="system">{t('themeSystem')}</option>
        <option value="light">{t('themeLight')}</option>
        <option value="dark">{t('themeDark')}</option>
      </FieldSelect>
    </label>
  )
}
