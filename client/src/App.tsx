
import { Route, Routes } from 'react-router'

import { FeaturePlaceholder } from './features/FeaturePlaceholder'
import { SessionGate } from './components/auth/SessionGate'
import { WorkspaceGate } from './features/auth/WorkspaceGate'
import { Applayout } from './components/layout/Applayout'

import DashboardPage from './features/dashboard/DashboardPage'
import LoginPage from './features/auth/LoginPage'
import RegisterPage from './features/auth/RegisterPage'
import WorkspaceOnboardingPage from './features/workspace/WorkspaceOnboardingPage'

export default function App() {
  return (
    <Routes>
      {/* Public routes: redirect signed-in users away from login/register */}
      <Route element={<SessionGate requireAuth={false} />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* All routes below require an authenticated session */}
      <Route element={<SessionGate requireAuth={true} />}>
        {/* Authenticated users can create their workspace */}
        <Route
          path="/onboarding"
          element={<WorkspaceOnboardingPage />}
        />

        {/* The remaining CRM routes require an existing workspace */}
        <Route element={<WorkspaceGate />}>
          <Route element={<Applayout />}>
            <Route index element={<DashboardPage />} />

            <Route
              path="companies"
              element={
                <FeaturePlaceholder
                  title="Companies"
                  description="Manage the businesses your team works with."
                />
              }
            />

            <Route
              path="contacts"
              element={
                <FeaturePlaceholder
                  title="Contacts"
                  description="Organize people and their company relationships."
                />
              }
            />

            <Route
              path="leads"
              element={
                <FeaturePlaceholder
                  title="Leads"
                  description="Track and qualify potential customers."
                />
              }
            />

            <Route
              path="deals"
              element={
                <FeaturePlaceholder
                  title="Deals"
                  description="Manage sales opportunities and pipeline stages."
                />
              }
            />

            <Route
              path="tasks"
              element={
                <FeaturePlaceholder
                  title="Tasks"
                  description="Organize follow-ups, deadlines, and priorities."
                />
              }
            />

            <Route
              path="*"
              element={
                <FeaturePlaceholder
                  title="Page not found"
                  description="The requested page does not exist."
                />
              }
            />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}
