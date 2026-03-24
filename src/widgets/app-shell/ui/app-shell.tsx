import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { LanguageToggle } from '@/features/language-toggle'
import {
  SubscriptionPaywallModal,
  useUserSubscriptionQuery,
  useVerifyCheckoutSessionQuery,
  useWriteUserSubscriptionMutation,
} from '@/features/billing-checkout'
import { ThemeToggle } from '@/features/theme-toggle'
import { useI18n } from '@/shared/lib'
import { Button } from '@/shared/ui'
import { usePreferencesStore, useThemeStore } from '@/shared/model'

const getNavClassName = ({ isActive }: { isActive: boolean }) => `shell-nav-link${isActive ? ' active' : ''}`

export const AppShell = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth()
  const { t } = useI18n()
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme())
  const subscriptionStatus = usePreferencesStore((state) => state.subscriptionStatus)
  const setSubscriptionStatus = usePreferencesStore((state) => state.setSubscriptionStatus)
  const setSubscriptionPlan = usePreferencesStore((state) => state.setSubscriptionPlan)
  const location = useLocation()
  const [showPaywall, setShowPaywall] = useState(false)

  const checkoutStatus = useMemo(() => {
    const params = new URLSearchParams(location.search)
    const checkout = params.get('checkout')
    const plan = params.get('plan')
    const sessionId = params.get('session_id')
    return { checkout, plan, sessionId }
  }, [location.search])
  const subscriptionQuery = useUserSubscriptionQuery(user?.uid)
  const verifySessionQuery = useVerifyCheckoutSessionQuery(user?.uid, checkoutStatus.sessionId ?? undefined)
  const writeSubscriptionMutation = useWriteUserSubscriptionMutation(user?.uid ?? '')

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme
  }, [resolvedTheme])

  useEffect(() => {
    if (!subscriptionQuery.data) {
      return
    }
    setSubscriptionPlan(subscriptionQuery.data.plan)
    setSubscriptionStatus(subscriptionQuery.data.status)
  }, [setSubscriptionPlan, setSubscriptionStatus, subscriptionQuery.data])

  useEffect(() => {
    if (!user?.uid || !checkoutStatus.sessionId) {
      return
    }
    if (verifySessionQuery.data) {
      const nextPlan = verifySessionQuery.data.plan === 'business' ? 'business' : 'pro'
      const nextStatus = verifySessionQuery.data.status === 'active' ? 'active' : 'inactive'
      setSubscriptionPlan(nextPlan)
      setSubscriptionStatus(nextStatus)
      void writeSubscriptionMutation.mutateAsync({ plan: nextPlan, status: nextStatus })
      return
    }

    if (verifySessionQuery.isError && checkoutStatus.checkout === 'success') {
      const fallbackPlan = checkoutStatus.plan === 'business' ? 'business' : 'pro'
      setSubscriptionPlan(fallbackPlan)
      setSubscriptionStatus('active')
      void writeSubscriptionMutation.mutateAsync({ plan: fallbackPlan, status: 'active' })
    }
  }, [checkoutStatus.checkout, checkoutStatus.plan, checkoutStatus.sessionId, setSubscriptionPlan, setSubscriptionStatus, user?.uid, verifySessionQuery.data, verifySessionQuery.isError, writeSubscriptionMutation])

  useEffect(() => {
    if (location.pathname === '/billing') {
      setShowPaywall(false)
      return
    }

    if (subscriptionStatus !== 'active') {
      setShowPaywall(true)
      return
    }

    setShowPaywall(false)
  }, [location.pathname, subscriptionStatus])

  const sectionTitle = useMemo(() => {
    if (location.pathname.startsWith('/dashboard') || location.pathname === '/') return t('dashboard')
    if (location.pathname.startsWith('/backlog')) return t('backlog')
    if (location.pathname.startsWith('/board')) return t('board')
    if (location.pathname.startsWith('/sprints')) return t('sprints')
    if (location.pathname.startsWith('/roadmap')) return t('roadmap')
    if (location.pathname.startsWith('/team')) return t('team')
    if (location.pathname.startsWith('/reports')) return t('reports')
    if (location.pathname.startsWith('/integrations')) return t('integrations')
    if (location.pathname.startsWith('/settings')) return t('settings')
    if (location.pathname.startsWith('/billing')) return t('billing')
    if (location.pathname.startsWith('/work-items')) return t('workItem')
    return t('workspace')
  }, [location.pathname, t])

  return (
    <div className="shell shell-layout">
      <aside className="shell-sidebar">
        <div className="brand-wrap">
          <Link to="/" className="brand-title">
            FlexPilot SaaS
          </Link>
          <p className="brand-subtitle">Delivery workspace</p>
        </div>

        <nav className="shell-nav">
          <div className="nav-group-title">{t('delivery')}</div>
          <div className="nav-group">
            <NavLink to="/dashboard" className={getNavClassName}>
              {t('dashboard')}
            </NavLink>
            <NavLink to="/backlog" className={getNavClassName}>
              {t('backlog')}
            </NavLink>
            <NavLink to="/board" className={getNavClassName}>
              {t('board')}
            </NavLink>
            <NavLink to="/sprints" className={getNavClassName}>
              {t('sprints')}
            </NavLink>
            <NavLink to="/roadmap" className={getNavClassName}>
              {t('roadmap')}
            </NavLink>
          </div>
          <div className="nav-group-title">{t('organisation')}</div>
          <div className="nav-group">
            <NavLink to="/team" className={getNavClassName}>
              {t('team')}
            </NavLink>
            <NavLink to="/reports" className={getNavClassName}>
              {t('reports')}
            </NavLink>
            <NavLink to="/integrations" className={getNavClassName}>
              {t('integrations')}
            </NavLink>
            <NavLink to="/settings" className={getNavClassName}>
              {t('settings')}
            </NavLink>
            <NavLink to="/billing" className={getNavClassName}>
              {t('billing')}
            </NavLink>
          </div>
        </nav>
      </aside>

      <div className="shell-main">
        <header className="shell-topbar">
          <div>
            <h1 className="topbar-title">{sectionTitle}</h1>
            <p className="topbar-subtitle">{t('topbarSubtitle')}</p>
          </div>
          <span className="user-pill">{user?.email ?? 'Unknown user'}</span>

          <div className="shell-actions">
            <LanguageToggle />
            <ThemeToggle />
            <Button type="button" tone="muted" onClick={() => void logout()}>
              {t('logout')}
            </Button>
          </div>
        </header>

        <main className="shell-content">{children}</main>
      </div>
      <SubscriptionPaywallModal
        open={Boolean(user) && showPaywall}
        userId={user?.uid}
        userEmail={user?.email ?? undefined}
        onActivateSubscription={() => {
          setSubscriptionPlan('pro')
          setSubscriptionStatus('active')
          setShowPaywall(false)
          if (user?.uid) {
            void writeSubscriptionMutation.mutateAsync({
              plan: 'pro',
              status: 'active',
            })
          }
        }}
      />
    </div>
  )
}
