import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import Turnstile from '../components/Turnstile'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [accept, setAccept] = useState(false)
  const [error, setError] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [ok, setOk] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (!accept) return setError('Debes aceptar la política de privacidad y términos')
      if (!password || password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres')
      if (password !== confirmPassword) return setError('Las contraseñas no coinciden')
      // El backend requiere securityCode; lo generamos automáticamente para clientes
      const securityCode = String(Math.floor(100000 + Math.random() * 900000))
      await api('/auth/register', {
        method: 'POST',
        body: { email, password, fullName, role: 'client', securityCode, turnstileToken },
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
          <label className="block text-sm mb-1">Confirmar contraseña</label>
          <input className="w-full border rounded px-3 py-2" type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required />
        </div>
        <div className="flex items-center gap-2">
          <input id="accept" type="checkbox" checked={accept} onChange={e=>setAccept(e.target.checked)} />
          <label htmlFor="accept" className="text-sm">Acepto la política de privacidad y los términos y condiciones</label>
        </div>
        <div className="flex justify-center">
          <Turnstile onVerify={setTurnstileToken} />
        </div>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">Registrarme</button>
      </form>
      <div className="mt-4 text-sm">
        <Link className="text-blue-700" to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
      </div>
    </div>
  )
}
