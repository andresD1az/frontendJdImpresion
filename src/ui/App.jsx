import React, { useEffect, useRef, useState } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'
import VerifyEmail from '../pages/VerifyEmail.jsx'
import RequestReset from '../pages/RequestReset.jsx'
import ResetPassword from '../pages/ResetPassword.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import Locked from '../pages/Locked.jsx'
import ClientHome from '../pages/ClientHome.jsx'
import AdminEmployees from '../pages/AdminEmployees.jsx'
import ChangePassword from '../pages/ChangePassword.jsx'
import Manager from '../pages/Manager.jsx'
import Bodega from '../pages/Bodega.jsx'
import Surtido from '../pages/Surtido.jsx'
const Descargue = () => <div className="max-w-3xl mx-auto p-4"> <h1 className="text-2xl font-semibold">Panel Descargue</h1><p className="mt-2 text-gray-600">Tareas de descargue.</p></div>
import { AuthProvider, useAuth } from '../context/AuthContext.jsx'
import ProtectedRoute from '../components/ProtectedRoute.jsx'
import useActivityPing from '../hooks/useActivityPing.js'
import Profile from '../pages/Profile.jsx'
import Inventory from '../pages/Inventory.jsx'
import AccessibilityToolbar from '../components/AccessibilityToolbar.jsx'

function Nav() {
  const { token, user, logout } = useAuth()
  const role = (user?.role || '').toLowerCase()
  const homePath = !token ? '/' : (
    role === 'manager' ? '/manager'
    : role === 'bodega' ? '/bodega'
    : role === 'surtido' ? '/surtido'
    : role === 'descargue' ? '/descargue'
    : role === 'client' ? '/cliente'
    : '/dashboard'
  )
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function onDocClick(e) {
      if (!menuRef.current) return
      if (!menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  return (
    <nav className="p-4 flex items-center justify-between bg-white shadow">
      <div className="flex gap-4 items-center">
        <Link className="font-semibold" to={homePath}>Inicio</Link>
        {token && (
          <>
            {role === 'manager' && <Link to="/admin/empleados">Empleados</Link>}
            {role === 'manager' && <Link to="/inventario">Inventario</Link>}
            {(role === 'manager' || role === 'surtido') && <Link to="/surtido">Surtidos</Link>}
            {(role === 'manager' || role === 'bodega') && <Link to="/bodega">Bodega</Link>}
            {role === 'descargue' && <Link to="/descargue">Descargue</Link>}
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        {!token && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Registro</Link>
          </>
        )}
        {token && (
          <div className="relative" ref={menuRef}>
            <button aria-haspopup="menu" aria-expanded={open} className="flex items-center gap-2 focus:outline-none" onClick={()=>setOpen(o=>!o)}>
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                  {(user?.full_name || user?.email || 'U').slice(0,1).toUpperCase()}
                </div>
              )}
              <span className="hidden sm:block">{user?.full_name || user?.email}</span>
            </button>
            {open && (
              <div role="menu" className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg border">
                <Link role="menuitem" className="block px-3 py-2 hover:bg-gray-50" to="/profile" onClick={()=>setOpen(false)}>Perfil</Link>
                <Link role="menuitem" className="block px-3 py-2 hover:bg-gray-50" to="/settings/password" onClick={()=>setOpen(false)}>Cambiar contraseña</Link>
                <button role="menuitem" className="w-full text-left px-3 py-2 hover:bg-gray-50 text-red-600" onClick={()=>{ setOpen(false); logout() }}>Cerrar sesión</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

function Layout() {
  const { token, user, fetchMe } = useAuth()
  const role = (user?.role || '').toLowerCase()
  // Call hook at top level with enabled flag
  useActivityPing({ minIntervalMs: 20000, checkIntervalMs: 15000, enabled: role !== 'client' })
  React.useEffect(() => {
    if (token && !user) fetchMe()
  }, [token])
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white border px-3 py-1 rounded shadow">Saltar al contenido principal</a>
      <Nav />
      <AccessibilityToolbar />
      <main id="main" className="flex-1 p-6" role="main">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/password/request" element={<RequestReset />} />
          <Route path="/password/reset" element={<ResetPassword />} />

          {/* Role-specific dashboards */}
          <Route path="/manager" element={<ProtectedRoute roles={['manager']}><Manager /></ProtectedRoute>} />
          <Route path="/bodega" element={<ProtectedRoute roles={['bodega','manager']}><Bodega /></ProtectedRoute>} />
          <Route path="/descargue" element={<ProtectedRoute roles={['descargue','manager']}><Descargue /></ProtectedRoute>} />
          <Route path="/surtido" element={<ProtectedRoute roles={['surtido','manager']}><Surtido /></ProtectedRoute>} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/locked" element={<ProtectedRoute allowLocked><Locked /></ProtectedRoute>} />
          <Route path="/cliente" element={<ClientHome />} />
          <Route path="/admin/empleados" element={<ProtectedRoute roles={['manager']}><AdminEmployees /></ProtectedRoute>} />
          <Route path="/inventario" element={<ProtectedRoute roles={['manager']}><Inventory /></ProtectedRoute>} />
          <Route path="/settings/password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
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
