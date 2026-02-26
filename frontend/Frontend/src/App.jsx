import './App.css'
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import useAuth from './context/useAuth.js'
import FirstPage from './components/FirstPage.jsx'
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
  const { user } = useAuth();

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
  )
}

export default App
