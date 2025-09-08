import React, { useState } from 'react'
import Turnstile from '../components/Turnstile'
import { useAuth } from '../context/AuthContext'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Login() {
  const { login, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const humanize = (code) => {
    switch (code) {
      case 'invalid_credentials':
        return 'Correo o contraseña incorrectos.'
      case 'email_not_verified':
        return 'Debes verificar tu correo antes de iniciar sesión.'
      case 'captcha_failed':
        return 'No se pudo validar el reCAPTCHA. Intenta nuevamente.'
      default:
        return 'No se pudo iniciar sesión. Inténtalo otra vez.'
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const res = await login({ email, password, turnstileToken })
    if (res.ok) {
      const role = res.user?.role
      if (role === 'client') return navigate('/cliente', { replace: true })
      if (role === 'manager') return navigate('/manager', { replace: true })
      if (role === 'bodega') return navigate('/bodega', { replace: true })
      if (role === 'descargue') return navigate('/descargue', { replace: true })
      if (role === 'surtido') return navigate('/surtido', { replace: true })
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    } else {
      setError(humanize(res.error))
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Iniciar sesión</h1>
      {error && <div className="mb-3 text-red-600">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Correo</label>
          <input className="w-full border rounded px-3 py-2" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Contraseña</label>
          <input className="w-full border rounded px-3 py-2" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <div className="flex justify-center">
          <Turnstile onVerify={setTurnstileToken} />
        </div>
        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">{loading ? 'Ingresando...' : 'Ingresar'}</button>
      </form>
      <div className="mt-4 flex justify-between text-sm">
        <Link className="text-blue-700" to="/register">Crear cuenta</Link>
        <Link className="text-blue-700" to="/password/request">¿Olvidaste tu contraseña?</Link>
      </div>
    </div>
  )
}
