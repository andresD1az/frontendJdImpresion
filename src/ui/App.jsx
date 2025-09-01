import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'
import VerifyEmail from '../pages/VerifyEmail.jsx'
import RequestReset from '../pages/RequestReset.jsx'
import ResetPassword from '../pages/ResetPassword.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import Locked from '../pages/Locked.jsx'
import { AuthProvider, useAuth } from '../context/AuthContext.jsx'
import ProtectedRoute from '../components/ProtectedRoute.jsx'
import useActivityPing from '../hooks/useActivityPing.js'

function Nav() {
  const { token, logout } = useAuth()
  return (
    <nav className="p-4 flex gap-4 bg-white shadow">
      <Link className="font-semibold" to="/">Inicio</Link>
      {!token && (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Registro</Link>
        </>
      )}
      {token && (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <button className="text-red-600" onClick={logout}>Cerrar sesión</button>
        </>
      )}
    </nav>
  )
}

function Layout() {
  // Global watcher: ensures lock detection without user movement
  useActivityPing({ minIntervalMs: 15000, checkIntervalMs: 1000 })
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/password/request" element={<RequestReset />} />
          <Route path="/password/reset" element={<ResetPassword />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/locked" element={<ProtectedRoute allowLocked><Locked /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  )
}
