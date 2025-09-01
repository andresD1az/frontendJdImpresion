import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [securityCode, setSecurityCode] = useState('')
  const [error, setError] = useState('')
  const [ok, setOk] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api('/auth/register', {
        method: 'POST',
        body: { email, password, fullName, securityCode },
      })
      setOk(true)
      setTimeout(() => {
        navigate('/verify-email', { state: { email } })
      }, 600)
    } catch (e) {
      setError(e?.data?.error || 'register_error')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Crear cuenta</h1>
      {error && <div className="mb-3 text-red-600">{String(error)}</div>}
      {ok && <div className="mb-3 text-green-700">Registro exitoso. Verifica tu correo.</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Nombre completo</label>
          <input className="w-full border rounded px-3 py-2" value={fullName} onChange={e=>setFullName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Correo</label>
          <input className="w-full border rounded px-3 py-2" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Contraseña</label>
          <input className="w-full border rounded px-3 py-2" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Código de seguridad (6-8 dígitos)</label>
          <input
            className="w-full border rounded px-3 py-2"
            inputMode="numeric"
            pattern="[0-9]{6,8}"
            minLength={6}
            maxLength={8}
            value={securityCode}
            onChange={e => setSecurityCode(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500 mt-1">Se usará para desbloquear el dashboard si se bloquea por inactividad.</p>
        </div>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">Registrarme</button>
      </form>
      <div className="mt-4 text-sm">
        <Link className="text-blue-700" to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
      </div>
    </div>
  )
}
