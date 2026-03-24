import { useI18n } from '@/shared/lib'
import { FieldSelect } from '@/shared/ui'

export const LanguageToggle = () => {
  const { t, language, setLanguage } = useI18n()

  return (
    <label className="theme-toggle">
      {t('language')}
      <FieldSelect value={language} onChange={(event) => setLanguage(event.target.value === 'en' ? 'en' : 'fr')}>
        <option value="fr">FR</option>
        <option value="en">EN</option>
      </FieldSelect>
    </label>
  )
}
