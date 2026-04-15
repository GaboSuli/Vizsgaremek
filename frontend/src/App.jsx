import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import useAuth from './context/useAuth.js'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { CookieProvider } from './context/CookieContext.jsx'
import FirstPage from './components/FirstPage.jsx'
import LoginPage from './components/LoginPage.jsx'
import RegisterPage from './components/RegisterPage.jsx'
import LandingPage from './components/LandingPage.jsx'
import StatisticsPage from './components/StatisticsPage.jsx'
import KuponPage from './components/KuponPage.jsx'
import ShoppingListPage from './components/ShoppingListPage.jsx'
import GroupDetailPage from './components/GroupDetailPage.jsx'
import GroupsPage from './components/GroupsPage.jsx'
import AdminDashboard from './components/Admin/AdminDashboard.jsx'
import ContactPage from './components/ContactPage.jsx'
import UserManagementPage from './components/UserManagementPage.jsx'
import ProfilePage from './components/Profile/ProfilePage.jsx'
import CouponModeratorPage from './components/Kupon/CouponModeratorPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PublicRoute from './components/PublicRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import ModeratorRoute from './components/ModeratorRoute.jsx'
import AppLayout from './components/AppLayout.jsx'
import CookieConsentBanner from './components/Cookie/CookieConsentBanner.jsx'
import CookieSettingsModal from './components/Cookie/CookieSettingsModal.jsx'
import CookiePolicyPage from './components/Cookie/CookiePolicyPage.jsx'
import PrivacyPolicyPage from './components/Cookie/PrivacyPolicyPage.jsx'

function AppRoutes() {
  const { user, loading } = useAuth();

  return (
    <Routes>
      {/* public pages */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <FirstPage />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* public policy pages */}
      <Route path="/cookie-szabalyzat" element={<CookiePolicyPage />} />
      <Route path="/adatkezeles" element={<PrivacyPolicyPage />} />

      {/* all functional pages live under layout and are protected */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<LandingPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/stats" element={<StatisticsPage />} />
        <Route path="/shopping" element={<ShoppingListPage />} />
        <Route path="/csoport/:id" element={<GroupDetailPage />} />
        <Route path="/kupon" element={<KuponPage />} />
        <Route path="/user" element={<ProfilePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/kupon-moderator" element={
          <ModeratorRoute>
            <CouponModeratorPage />
          </ModeratorRoute>
        } />
      </Route>

      {/* fallback */}
      <Route path="*" element={loading ? null : <Navigate to={user ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CookieProvider>
        <AppRoutes />
        <CookieConsentBanner />
        <CookieSettingsModal />
      </CookieProvider>
    </ThemeProvider>
  );
}
