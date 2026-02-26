import './App.css'
<<<<<<< Updated upstream
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import useAuth from './context/useAuth.js'
import FirstPage from './components/FirstPage.jsx'
=======
import React, { useState, useMemo } from 'react'
import { isAuthenticated, getStoredUserInfo } from './services/authService.js'
import { useUser } from './contexts/UserContext.jsx'
import Sidebar from './components/Sidebar.jsx'
>>>>>>> Stashed changes
import LoginPage from './components/LoginPage.jsx'
import RegisterPage from './components/RegisterPage.jsx'
import LandingPage from './components/LandingPage.jsx'
import StatisticsPage from './components/StatisticsPage.jsx'
import VevesiListePage from './components/VevesiListePage.jsx'
import KuponPage from './components/KuponPage.jsx'
import ShoppingListPage from './components/ShoppingListPage.jsx'
import AdminPage from './components/AdminPage.jsx'
import ContactPage from './components/ContactPage.jsx'
import UserManagementPage from './components/UserManagementPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PublicRoute from './components/PublicRoute.jsx'
import AppLayout from './components/AppLayout.jsx'

function App() {
<<<<<<< Updated upstream
  const { user } = useAuth();
=======
  const { user } = useUser()
  const isAuthOnLoad = isAuthenticated() || !!user

  const { initialPage, initialActive } = useMemo(() => {
    let page = 'home'
    let activeTab = 'home'

    if (isAuthOnLoad) {
      const userInfo = getStoredUserInfo() || user

      const isAdmin = userInfo?.email?.includes('admin') || userInfo?.role === 'admin' || userInfo?.type === 'admin'

      if (isAdmin) {
        page = 'admin'
        activeTab = 'admin'
      }
    }

    return { initialPage: page, initialActive: activeTab }
  }, [isAuthOnLoad, user])

  const [currentPage, setCurrentPage] = useState(initialPage)
  const [collapsed, setCollapsed] = useState(false)
  const [active, setActive] = useState(initialActive)
  const [showLogin, setShowLogin] = useState(false)

  const handlePageChange = (page) => {
    // If not authenticated, open login instead of changing protected pages
    const auth = isAuthenticated() || !!user
    if (!auth) {
      setShowLogin(true)
      return
    }

    setCurrentPage(page)
    setActive(page)
  }

  const renderPage = () => {
    switch(currentPage) {
      case 'stats':
        return <StatisticsPage />
      case 'lista':
        return <VevesiListePage />
      case 'kupon':
        return <KuponPage />
      case 'shopping':
        return <ShoppingListPage />
      case 'admin':
        return <AdminPage />
      case 'contact':
        return <ContactPage />
      case 'user':
        return <UserManagementPage />
      case 'home':
      default:
        return <LandingPage />
    }
  }



  const authenticated = isAuthenticated() || !!user

  // Always render the sidebar/layout. If not authenticated, show LandingPage
  // as main content and open LoginPage on protected navigation or button.
>>>>>>> Stashed changes

  return (
    <Routes>
      {/* public pages */}
      <Route path="/" element={<FirstPage />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
<<<<<<< Updated upstream
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* all functional pages live under layout and are protected */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<LandingPage />} />
        <Route path="/stats" element={<StatisticsPage />} />
        <Route path="/lista" element={<VevesiListePage />} />
        <Route path="/shopping" element={<ShoppingListPage />} />
        <Route path="/kupon" element={<KuponPage />} />
        <Route path="/user" element={<UserManagementPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route index element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
    </Routes>
=======
      <main className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
        {!authenticated && (
          <>
            <LandingPage />
            <div style={{display: 'flex', justifyContent: 'center', marginTop: 20}}>
              <button className="btn btn-primary" onClick={() => setShowLogin(true)}>Bejelentkezés</button>
            </div>
            {showLogin && (
              <div style={{marginTop:20}}>
                <LoginPage onSuccess={() => { setShowLogin(false) }} />
              </div>
            )}
          </>
        )}

        {authenticated && renderPage()}
      </main>
    </div>
>>>>>>> Stashed changes
  )
}

export default App
