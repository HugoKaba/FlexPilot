import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Component, Suspense, type ReactNode } from 'react'
import { AuthProvider, useAuth } from '@/features/auth'
import { AuthPage } from '@/pages/auth-page'
import { BacklogPage } from '@/pages/backlog-page'
import { BillingPage } from '@/pages/billing-page'
import { BoardPage } from '@/pages/board-page'
import { DashboardPage } from '@/pages/dashboard-page'
import { InvitePage } from '@/pages/invite-page'
import { IntegrationsPage } from '@/pages/integrations-page'
import { WorkItemPage } from '@/pages/work-item-page'
import { ReportsPage } from '@/pages/reports-page'
import { RoadmapPage } from '@/pages/roadmap-page'
import { SettingsPage } from '@/pages/settings-page'
import { SprintDetailPage } from '@/pages/sprint-detail-page'
import { SprintsPage } from '@/pages/sprints-page'
import { TeamPage } from '@/pages/team-page'
import { AppShell } from '@/widgets/app-shell'
import { queryClient } from '@/app/providers/query-client'
import '@/app/styles/global.css'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <p className="status">Chargement de la session...</p>
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <p className="status">Chargement de la session...</p>
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

const protectedPages = [
  { path: '/', element: <DashboardPage /> },
  { path: '/dashboard', element: <DashboardPage /> },
  { path: '/backlog', element: <BacklogPage /> },
  { path: '/board', element: <BoardPage /> },
  { path: '/sprints', element: <SprintsPage /> },
  { path: '/sprints/:sprintId', element: <SprintDetailPage /> },
  { path: '/roadmap', element: <RoadmapPage /> },
  { path: '/reports', element: <ReportsPage /> },
  { path: '/integrations', element: <IntegrationsPage /> },
  { path: '/team', element: <TeamPage /> },
  { path: '/settings', element: <SettingsPage /> },
  { path: '/billing', element: <BillingPage /> },
  { path: '/invite/:token', element: <InvitePage /> },
  { path: '/work-items/:itemId', element: <WorkItemPage /> },
] as const

class AppErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="page">
          <article className="card">
            <h2>Une erreur est survenue</h2>
            <p className="page-subtitle">Recharge la page ou reconnecte-toi.</p>
          </article>
        </section>
      )
    }

    return this.props.children
  }
}

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppErrorBoundary>
            <Suspense fallback={<p className="status">Chargement des données...</p>}>
              <Routes>
                <Route
                  path="/auth"
                  element={
                    <PublicRoute>
                      <AuthPage />
                    </PublicRoute>
                  }
                />
                {protectedPages.map((page) => (
                  <Route
                    key={page.path}
                    path={page.path}
                    element={
                      <ProtectedRoute>
                        <AppShell>{page.element}</AppShell>
                      </ProtectedRoute>
                    }
                  />
                ))}
                <Route path="*" element={<Navigate to="/auth" replace />} />
              </Routes>
            </Suspense>
          </AppErrorBoundary>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
