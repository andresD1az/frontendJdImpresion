import React, { useEffect, useRef, useState } from 'react'
import { Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom'
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
import StoreCatalog from '../pages/StoreCatalog.jsx'
import Cart from '../pages/Cart.jsx'
import MyOrders from '../pages/MyOrders.jsx'
import Operativo from '../pages/Operativo.jsx'
import Ventas from '../pages/Ventas.jsx'
import Caja from '../pages/Caja.jsx'
import Soporte from '../pages/Soporte.jsx'
import ClientInvoices from '../pages/ClientInvoices.jsx'
import ClientReturns from '../pages/ClientReturns.jsx'
import ProductDetail from '../pages/ProductDetail.jsx'
import PermissionGuard from '../app/router/guards/PermissionGuard.jsx'
import PermAny from '../app/router/guards/PermAny.jsx'

function Nav() {
  const { token, user, logout } = useAuth()
  const role = (user?.role || '').toLowerCase()
  const homePath = !token ? '/' : (
    role === 'manager' ? '/manager'
    : role === 'bodega' ? '/bodega'
    : role === 'surtido' ? '/surtido'
    : role === 'descargue' ? '/descargue'
    : role === 'client' ? '/tienda'
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
            {(role === 'client' || role === 'manager') && <Link to="/tienda">Tienda</Link>}
            {(role === 'client' || role === 'manager') && <Link to="/carrito">Carrito</Link>}
            {(role === 'client' || role === 'manager') && <Link to="/mis-pedidos">Mis pedidos</Link>}
            {(role === 'client' || role === 'manager') && <Link to="/mis-facturas">Mis facturas</Link>}
            {(role === 'client' || role === 'manager') && <Link to="/mis-devoluciones">Mis devoluciones</Link>}
            {role === 'manager' && <Link to="/operativo">Operativo</Link>}
            {role === 'manager' && <Link to="/ventas">Ventas</Link>}
            {role === 'manager' && <Link to="/caja">Caja</Link>}
            {role === 'manager' && <Link to="/soporte">Soporte</Link>}
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

function AdminNav() {
  const { token, user, logout } = useAuth()
  const role = (user?.role || '').toLowerCase()
  const perms = user?.perms || []
  const can = p => perms.includes(p)
  const itemsBase = []
  if (role === 'manager' || can('report:view')) itemsBase.push({ label: 'Inicio', to: '/manager' })
  if (role === 'manager' || can('user:manage')) itemsBase.push({ label: 'Empleados', to: '/admin/empleados' })
  if (role === 'manager' || can('inventory:view')) itemsBase.push({ label: 'Inventario', to: '/inventario' })
  if (role === 'manager') itemsBase.push({ label: 'Operativo', to: '/operativo' })
  if (role === 'manager' || can('product:view')) itemsBase.push({ label: 'Ventas', to: '/ventas' })
  if (role === 'manager' || can('payment:reconcile') || can('invoice:emit')) itemsBase.push({ label: 'Caja', to: '/caja' })
  if (role === 'manager' || can('return:manage')) itemsBase.push({ label: 'Devoluciones', to: '/soporte' })
  // Específicos por rol operativo
  if (role === 'bodega') itemsBase.push({ label: 'Bodega', to: '/bodega' })
  if (role === 'surtido') itemsBase.push({ label: 'Surtido', to: '/surtido' })
  if (role === 'descargue') itemsBase.push({ label: 'Descargue', to: '/descargue' })
  const items = itemsBase.length ? itemsBase : [{ label: 'Dashboard', to: '/dashboard' }]

  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  useEffect(() => {
    function onDocClick(e) { if (!menuRef.current) return; if (!menuRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  return (
    <nav className="p-4 flex items-center justify-between bg-white shadow">
      <div className="flex gap-6 items-center">
        <a className="font-semibold" href={items[0]?.to || '/dashboard'}>Panel</a>
        {token && (
          <div className="hidden md:flex items-center gap-4 text-sm">
            {items.map(it => (<a key={it.to} href={it.to} className="hover:underline">{it.label}</a>))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
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
                <a role="menuitem" className="block px-3 py-2 hover:bg-gray-50" href="/profile" onClick={()=>setOpen(false)}>Perfil</a>
                <a role="menuitem" className="block px-3 py-2 hover:bg-gray-50" href="/settings/password" onClick={()=>setOpen(false)}>Cambiar contraseña</a>
                <button role="menuitem" className="w-full text-left px-3 py-2 hover:bg-gray-50 text-red-600" onClick={()=>{ setOpen(false); logout() }}>Cerrar sesión</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export function ClientShell({ children }) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [cartCount, setCartCount] = useState(0)
  useEffect(() => {
    const read = () => {
      try { const raw = localStorage.getItem('cart'); const arr = raw? JSON.parse(raw):[]; setCartCount(arr.reduce((a,b)=>a+Number(b.quantity||0),0)) } catch { setCartCount(0) }
    }
    read()
    const onStorage = (e) => { if (e.key === 'cart') read() }
    const onCustom = () => read()
    window.addEventListener('storage', onStorage)
    window.addEventListener('cart-updated', onCustom)
    return () => { window.removeEventListener('storage', onStorage); window.removeEventListener('cart-updated', onCustom) }
  }, [])
  const goSearch = () => navigate(`/tienda${q?`?q=${encodeURIComponent(q)}`:''}`)
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/inicio" className="font-semibold text-lg">JD Impressions</a>
            <nav className="hidden md:flex items-center gap-4 text-sm text-gray-700">
              <a href="/tienda" className="hover:text-blue-700">Productos</a>
              <a href="/mis-pedidos" className="hover:text-blue-700">Mis pedidos</a>
              <a href="/mis-devoluciones" className="hover:text-blue-700">Mis devoluciones</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <input className="border rounded px-3 py-1.5 w-64" placeholder="Buscar productos..." value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&goSearch()} />
              <button className="border rounded px-3 py-1.5 hover:bg-gray-50" onClick={goSearch}>Buscar</button>
            </div>
            <a href="/carrito" className="relative border rounded px-3 py-1.5 hover:bg-gray-50">
              Carrito
              {cartCount>0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5">{cartCount}</span>
              )}
            </a>
          </div>
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
      <footer className="border-t py-8 text-sm text-gray-600">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="font-semibold mb-2">JD Impressions</div>
            <div>support@jdimpressions.com</div>
          </div>
          <div>
            <div className="font-semibold mb-2">Tienda</div>
            <ul className="space-y-1">
              <li><a href="/tienda" className="hover:underline">Productos</a></li>
              <li><a href="/mis-pedidos" className="hover:underline">Mis pedidos</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Soporte</div>
            <ul className="space-y-1">
              <li>WhatsApp</li>
              <li>Política de devoluciones</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Legal</div>
            <ul className="space-y-1">
              <li>Política de privacidad</li>
              <li>Términos de uso</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 mt-6">© 2025 JD Impressions. Todos los derechos reservados.</div>
      </footer>
    </div>
  )
}

export function AdminLayout() {
  const { token, user, fetchMe } = useAuth()
  const role = (user?.role || '').toLowerCase()
  const location = useLocation()
  // Call hook at top level with enabled flag
  useActivityPing({ minIntervalMs: 20000, checkIntervalMs: 15000, enabled: role !== 'client' })
  React.useEffect(() => {
    if (token && !user) fetchMe()
  }, [token])
  if (role === 'client') return <Navigate to="/inicio" replace />
  const defaultPathByRole = {
    manager: '/manager',
    bodega: '/bodega',
    surtido: '/surtido',
    descargue: '/descargue',
    cajero: '/caja',
    soporte: '/soporte',
    operativo: '/operativo',
    vendedor: '/ventas',
  }
  const wantRedirect = ['/dashboard','/admin','/'].includes(location.pathname)
  const target = defaultPathByRole[role]
  if (target && wantRedirect) return <Navigate to={target} replace />
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white border px-3 py-1 rounded shadow">Saltar al contenido principal</a>
      <AdminNav />
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
          <Route path="/operativo" element={<ProtectedRoute roles={['manager']}><Operativo /></ProtectedRoute>} />
          <Route path="/ventas" element={<ProtectedRoute roles={['manager']}><Ventas /></ProtectedRoute>} />
          <Route path="/caja" element={<PermAny perms={["invoice:emit","payment:reconcile"]}><Caja /></PermAny>} />
          <Route path="/soporte" element={<PermissionGuard perm="return:manage"><Soporte /></PermissionGuard>} />
          <Route path="/admin/empleados" element={<ProtectedRoute roles={['manager']}><AdminEmployees /></ProtectedRoute>} />
          <Route path="/inventario" element={<ProtectedRoute roles={['manager','bodega','surtido']}><Inventory /></ProtectedRoute>} />
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
      {/* Rutas separadas por layout */}
      <Routes>
        {/* Client storefront layout */}
        <Route path="/inicio" element={<ProtectedRoute roles={['client','manager']}><ClientShell><ClientHome /></ClientShell></ProtectedRoute>} />
        <Route path="/tienda" element={<ProtectedRoute roles={['client','manager']}><ClientShell><StoreCatalog /></ClientShell></ProtectedRoute>} />
        <Route path="/producto/:sku" element={<ProtectedRoute roles={['client','manager']}><ClientShell><ProductDetail /></ClientShell></ProtectedRoute>} />
        <Route path="/carrito" element={<ProtectedRoute roles={['client','manager']}><ClientShell><Cart /></ClientShell></ProtectedRoute>} />
        <Route path="/mis-pedidos" element={<ProtectedRoute roles={['client','manager']}><ClientShell><MyOrders /></ClientShell></ProtectedRoute>} />
        <Route path="/mis-facturas" element={<ProtectedRoute roles={['client','manager']}><ClientShell><ClientInvoices /></ClientShell></ProtectedRoute>} />
        <Route path="/mis-devoluciones" element={<ProtectedRoute roles={['client','manager']}><ClientShell><ClientReturns /></ClientShell></ProtectedRoute>} />

        {/* Admin and auth layout */}
        <Route path="*" element={<AdminLayout />} />
      </Routes>
    </AuthProvider>
  )
}
