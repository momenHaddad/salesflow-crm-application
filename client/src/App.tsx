
import { Route, Routes } from 'react-router'
import { FeaturePlaceholder } from './features/FeaturePlaceholder'
import { SessionGate } from './components/auth/SessionGate'
import { Applayout } from './components/layout/Applayout'
import DashboardPage from './features/dashboard/DashboardPage'
import LoginPage from './features/auth/LoginPage'
import RegisterPage from './features/auth/RegisterPage'

export default function App() {
  return (
    <Routes>
      <Route element={<SessionGate requireAuth={false} />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<SessionGate requireAuth={true} />}>
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
    </Routes>
  )
}
