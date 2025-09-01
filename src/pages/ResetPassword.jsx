import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { api } from '../lib/api'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [verified, setVerified] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const qEmail = params.get('email')
    if (qEmail) setEmail(qEmail)
  }, [location.search])

  const verifyCode = async () => {
    setMsg(''); setError('')
    setVerifying(true)
    try {
      await api('/auth/password/verify-code', { method: 'POST', body: { email, code } })
      setVerified(true)
      setMsg('Código verificado. Ahora ingresa tu nueva contraseña.')
    } catch (e) {
      setVerified(false)
      setError(e?.data?.error || 'invalid_code')
    } finally {
      setVerifying(false)
    }
  }

  const resendCode = async () => {
    setMsg(''); setError('')
    try {
      await api('/auth/password/request', { method: 'POST', body: { email } })
      setMsg('Código reenviado (si el correo existe). Revisa tu buzón.')
    } catch {
      setMsg('Solicitud enviada (si existe el correo).')
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setMsg(''); setError('')
    if (!verified) {
      await verifyCode()
      return
    }
    const p = password.trim()
    const c = confirmPassword.trim()
    if (p !== c) {
      setError('Las contraseñas no coinciden.')
      return
    }
    try {
      await api('/auth/password/reset', { method: 'POST', body: { email, code, newPassword: p } })
      setMsg('Contraseña actualizada. Inicia sesión con tu nueva contraseña.')
      setTimeout(()=>navigate('/login'), 800)
    } catch (e) {
      setError(e?.data?.error || 'password_reset_error')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Cambiar contraseña</h1>
      {msg && <div className="mb-3 text-green-700">{msg}</div>}
      {error && <div className="mb-3 text-red-600">{String(error)}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Correo</label>
          <input className="w-full border rounded px-3 py-2" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Código recibido por correo</label>
          <div className="flex gap-2">
            <input className="w-full border rounded px-3 py-2" value={code} onChange={e=>setCode(e.target.value)} required />
            <button type="button" onClick={verifyCode} disabled={verifying || !email || !code} className="px-3 py-2 rounded border bg-gray-100 disabled:opacity-50">{verifying ? 'Verificando...' : (verified ? 'Verificado' : 'Verificar')}</button>
          </div>
          <div className="mt-2 text-sm">
            <button type="button" onClick={resendCode} disabled={!email} className="underline text-blue-700 disabled:opacity-50">Reenviar código</button>
          </div>
        </div>
        {verified && (
          <>
            <div>
              <label className="block text-sm mb-1">Nueva contraseña</label>
              <input className="w-full border rounded px-3 py-2" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm mb-1">Confirmar nueva contraseña</label>
              <input className="w-full border rounded px-3 py-2" type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required />
              {(confirmPassword && password && password.trim() !== confirmPassword.trim()) && (
                <div className="text-sm text-red-600 mt-1">Las contraseñas no coinciden.</div>
              )}
            </div>
          </>
        )}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded" disabled={!email || !code || (verified && (!password || !confirmPassword || password.trim() !== confirmPassword.trim()))}> {verified ? 'Actualizar contraseña' : 'Verificar código'} </button>
      </form>
    </div>
  )
}
