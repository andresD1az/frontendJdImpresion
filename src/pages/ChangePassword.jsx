import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'

export default function ChangePassword() {
  const { token } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setMsg(''); setError('')
    if (newPassword.length < 6) return setError('La nueva contraseña debe tener al menos 6 caracteres.')
    if (newPassword !== confirm) return setError('Las contraseñas no coinciden.')
    setLoading(true)
    try {
      await api('/auth/change-password', { method: 'POST', token, body: { currentPassword, newPassword } })
      setMsg('Contraseña actualizada correctamente.')
      setCurrentPassword(''); setNewPassword(''); setConfirm('')
    } catch (e) {
      const code = e?.data?.error || 'change_password_error'
      if (code === 'invalid_current_password') setError('La contraseña actual es incorrecta.')
      else setError('No se pudo cambiar la contraseña.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Cambiar contraseña</h1>
      {msg && <div className="mb-3 text-green-700">{msg}</div>}
      {error && <div className="mb-3 text-red-600">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Contraseña actual</label>
          <input className="w-full border rounded px-3 py-2" type="password" value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Nueva contraseña</label>
          <input className="w-full border rounded px-3 py-2" type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Confirmar nueva contraseña</label>
          <input className="w-full border rounded px-3 py-2" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required />
        </div>
        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">{loading ? 'Guardando...' : 'Guardar cambios'}</button>
      </form>
    </div>
  )
}
