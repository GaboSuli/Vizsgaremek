
import './App.css'
import React, { useState } from 'react'
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

function App() {
  const { authenticated, initialPage, initialActive } = useMemo(() => {
    const isAuth = isAuthenticated()
    let page = 'home'
    let activeTab = 'home'

    if (isAuth) {
      const userInfo = getStoredUserInfo()

      // Check if user is admin (email contains 'admin' or role is admin)
      const isAdmin = userInfo?.email?.includes('admin') || userInfo?.role === 'admin' || userInfo?.type === 'admin'

      if (isAdmin) {
        page = 'admin'
        activeTab = 'admin'
      }
    }

    return {
      authenticated: isAuth,
      initialPage: page,
      initialActive: activeTab
    }
  }, [])

  const [currentPage, setCurrentPage] = useState(initialPage)
  const [collapsed, setCollapsed] = useState(false)
  const [active, setActive] = useState(initialActive)

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



  if (!authenticated) {
    return <LoginPage />
  }

  return (
    <div className="app-layout">
      <Sidebar 
        collapsed={collapsed}
        onToggle={() => setCollapsed(s => !s)}
        active={active}
        onNavigate={() => {}}
        onPageChange={handlePageChange}
      />
      <main className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
        {renderPage()}
      </main>
    </div>
  )
}

export default App
