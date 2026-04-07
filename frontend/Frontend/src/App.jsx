import './App.css'
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import useAuth from './context/useAuth.js'
import { ThemeProvider } from './context/ThemeContext.jsx'
import FirstPage from './components/FirstPage.jsx'
import LoginPage from './components/LoginPage.jsx'
import RegisterPage from './components/RegisterPage.jsx'
import LandingPage from './components/LandingPage.jsx'
import StatisticsPage from './components/StatisticsPage.jsx'
import KuponPage from './components/KuponPage.jsx'
import ShoppingListPage from './components/ShoppingListPage.jsx'
import GroupDetailPage from './components/GroupDetailPage.jsx'
import GroupsPage from './components/GroupsPage.jsx'
import AdminPage from './components/AdminPage.jsx'
import ContactPage from './components/ContactPage.jsx'
import UserManagementPage from './components/UserManagementPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PublicRoute from './components/PublicRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import AppLayout from './components/AppLayout.jsx'

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
        <Route path="/user" element={<UserManagementPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin" element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
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
      <AppRoutes />
    </ThemeProvider>
  );
}
