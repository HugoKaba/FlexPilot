import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import type { ReactNode } from 'react'
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

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/auth"
              element={
                <PublicRoute>
                  <AuthPage />
                </PublicRoute>
              }
            />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <DashboardPage />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <DashboardPage />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/backlog"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <BacklogPage />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/board"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <BoardPage />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/sprints"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <SprintsPage />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/sprints/:sprintId"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <SprintDetailPage />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/roadmap"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <RoadmapPage />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <ReportsPage />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/integrations"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <IntegrationsPage />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/team"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <TeamPage />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <SettingsPage />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/billing"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <BillingPage />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/invite/:token"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <InvitePage />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/work-items/:itemId"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <WorkItemPage />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
