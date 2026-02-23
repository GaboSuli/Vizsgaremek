import './App.css'
import React, { useState, useMemo } from 'react'
import { isAuthenticated, getStoredUserInfo } from './services/authService.js'
import Sidebar from './components/Sidebar.jsx'
import LoginPage from './components/LoginPage.jsx'
import LandingPage from './components/LandingPage.jsx'
import StatisticsPage from './components/StatisticsPage.jsx'
import VevesiListePage from './components/VevesiListePage.jsx'
import KuponPage from './components/KuponPage.jsx'
import ShoppingListPage from './components/ShoppingListPage.jsx'
import AdminPage from './components/AdminPage.jsx'
import ContactPage from './components/ContactPage.jsx'
import UserManagementPage from './components/UserManagementPage.jsx'
import FirstPage from './components/FirstPage.jsx'

function App() {
  const { initialPage, initialActive } = useMemo(() => {
    // Allow opening a specific page via ?page= or #page so landing buttons can link here
    const urlParams = new URLSearchParams(window.location.search);
    const hash = (window.location.hash || '').replace('#', '');
    const requested = (urlParams.get('page') || hash || '').trim();

    const allowedPages = ['home', 'stats', 'lista', 'kupon', 'shopping', 'admin', 'contact', 'user', 'login', 'register']

    let page = 'home'
    let activeTab = 'home'

    const isAuth = isAuthenticated()

    if (requested && allowedPages.includes(requested)) {
      page = requested
      activeTab = requested
    } else {
      if (isAuth) {
        const userInfo = getStoredUserInfo()

        // Check if user is admin (email contains 'admin' or role is admin)
        const isAdmin = userInfo?.email?.includes('admin') || userInfo?.role === 'admin' || userInfo?.type === 'admin'

        if (isAdmin) {
          page = 'admin'
          activeTab = 'admin'
        }
      }
    }

    return {
      initialPage: page,
      initialActive: activeTab
    }
  }, [])

  const [currentPage, setCurrentPage] = useState(initialPage)
  const [collapsed, setCollapsed] = useState(false)
  const [active, setActive] = useState(initialActive)

  const authenticatedNow = isAuthenticated();
  // Disable forced FirstPage during normal operation
  const FORCE_FIRSTPAGE = false;

  const handlePageChange = (page) => {
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

  // Make the entire site login-only: unauthenticated visitors see FirstPage,
  // but allow explicit ?page=login or ?page=register to show the auth form.
  if (FORCE_FIRSTPAGE) {
    return <FirstPage />
  }

  if (!authenticatedNow) {
    if (currentPage === 'login' || currentPage === 'register') {
      return <LoginPage />
    }
    return <FirstPage />
  }

  return (
    <div className="app-layout">
      <Sidebar 
        collapsed={collapsed}
        onToggle={() => setCollapsed(s => !s)}
        active={active}
        onNavigate={() => {}}
        onPageChange={handlePageChange}
        authenticated={authenticatedNow}
      />
      <main className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
        {renderPage()}
      </main>
    </div>
  )
}

export default App
