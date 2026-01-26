
import './App.css'
import React, { useState, useEffect } from 'react'
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

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [collapsed, setCollapsed] = useState(false)
  const [active, setActive] = useState('home')
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = isAuthenticated()
    setAuthenticated(isAuth)
    
    // If authenticated, check role and set page accordingly
    if (isAuth) {
      const userInfo = getStoredUserInfo()
      
      // Check if user is admin (email contains 'admin' or role is admin)
      const isAdmin = userInfo?.email?.includes('admin') || userInfo?.role === 'admin' || userInfo?.type === 'admin'
      
      if (isAdmin) {
        setCurrentPage('admin')
        setActive('admin')
      } else {
        setCurrentPage('home')
        setActive('home')
      }
    }
    
    setLoading(false)
  }, [])

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
      case 'home':
      default:
        return <LandingPage />
    }
  }

  if (loading) {
    return <div className="loading">Betöltés...</div>
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
