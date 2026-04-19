import './App.css'
import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import useAuth from './context/useAuth.js'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { CookieProvider } from './context/CookieContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PublicRoute from './components/PublicRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import ModeratorRoute from './components/ModeratorRoute.jsx'
import AppLayout from './components/AppLayout.jsx'

// Eagerly load cookie banner & modal (shown on all pages immediately)
import CookieConsentBanner from './components/Cookie/CookieConsentBanner.jsx'
import CookieSettingsModal from './components/Cookie/CookieSettingsModal.jsx'

// Lazy-load all pages — only the current page's chunk is downloaded
const FirstPage            = lazy(() => import('./components/FirstPage.jsx'))
const LoginPage            = lazy(() => import('./components/LoginPage.jsx'))
const RegisterPage         = lazy(() => import('./components/RegisterPage.jsx'))
const CookiePolicyPage     = lazy(() => import('./components/Cookie/CookiePolicyPage.jsx'))
const PrivacyPolicyPage    = lazy(() => import('./components/Cookie/PrivacyPolicyPage.jsx'))
const LandingPage          = lazy(() => import('./components/LandingPage.jsx'))
const GroupsPage           = lazy(() => import('./components/GroupsPage.jsx'))
const GroupDetailPage      = lazy(() => import('./components/GroupDetailPage.jsx'))
const StatisticsPage       = lazy(() => import('./components/StatisticsPage.jsx'))
const ShoppingListPage     = lazy(() => import('./components/ShoppingListPage.jsx'))
const KuponPage            = lazy(() => import('./components/KuponPage.jsx'))
const ProfilePage          = lazy(() => import('./components/Profile/ProfilePage.jsx'))
const ContactPage          = lazy(() => import('./components/ContactPage.jsx'))
const AdminDashboard       = lazy(() => import('./components/Admin/AdminDashboard.jsx'))
const CouponModeratorPage  = lazy(() => import('./components/Kupon/CouponModeratorPage.jsx'))
const DocsPage             = lazy(() => import('./components/Docs/DocsPage.jsx'))

function PageLoader() {
  return (
    <div className="loading-screen" aria-label="Betöltés...">
      <div className="spinner" />
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* public pages */}
        <Route path="/" element={<PublicRoute><FirstPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* public policy pages */}
        <Route path="/cookie-szabalyzat" element={<CookiePolicyPage />} />
        <Route path="/adatkezeles" element={<PrivacyPolicyPage />} />
        <Route path="/docs" element={<DocsPage />} />

        {/* all functional pages live under layout and are protected */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<LandingPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/stats" element={<StatisticsPage />} />
          <Route path="/shopping" element={<ShoppingListPage />} />
          <Route path="/csoport/:id" element={<GroupDetailPage />} />
          <Route path="/kupon" element={<KuponPage />} />
          <Route path="/user" element={<ProfilePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/kupon-moderator" element={<ModeratorRoute><CouponModeratorPage /></ModeratorRoute>} />
        </Route>

        {/* fallback */}
        <Route path="*" element={loading ? null : <Navigate to={user ? "/dashboard" : "/"} replace />} />
      </Routes>
    </Suspense>
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
