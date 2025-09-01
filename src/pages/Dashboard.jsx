import React from 'react'
import { useAuth } from '../context/AuthContext'
import useActivityPing from '../hooks/useActivityPing'

export default function Dashboard() {
  const { user } = useAuth()
  useActivityPing({ minIntervalMs: 15000, checkIntervalMs: 2000 })

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <div className="bg-white p-4 rounded shadow">
        <p>Bienvenido, <b>{user?.full_name || user?.email}</b></p>
        <p className="text-sm text-gray-600 mt-2">Esta pantalla se bloqueará tras 1 minuto de inactividad (según políticas del backend).</p>
      </div>
    </div>
  )
}
