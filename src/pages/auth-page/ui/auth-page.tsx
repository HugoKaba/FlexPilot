import { AuthForm } from '@/features/auth'
import { useI18n } from '@/shared/lib'

export const AuthPage = () => {
  const { t } = useI18n()

  return (
    <main className="auth-layout">
      <section className="auth-intro">
        <p className="auth-kicker">FlexPilot SaaS</p>
        <h1>{t('authTitle')}</h1>
        <p>{t('authSubtitle')}</p>
        <div className="auth-feature-list">
          <article className="auth-feature-card">
            <h2>{t('authFeatureBoardsTitle')}</h2>
            <p>{t('authFeatureBoardsText')}</p>
          </article>
          <article className="auth-feature-card">
            <h2>{t('authFeatureSprintTitle')}</h2>
            <p>{t('authFeatureSprintText')}</p>
          </article>
          <article className="auth-feature-card">
            <h2>{t('authFeatureBillingTitle')}</h2>
            <p>{t('authFeatureBillingText')}</p>
          </article>
        </div>
      </section>
      <div className="auth-form-shell">
        <p className="auth-form-title">{t('authSecureAccess')}</p>
        <p className="auth-form-subtitle">{t('authConnectToOpen')}</p>
        <div className="auth-card-wrap">
          <AuthForm />
        </div>
      </div>
    </main>
  )
}
