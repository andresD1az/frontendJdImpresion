import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  const fetchMe = async () => {
    if (!token) return
    try {
      const res = await api('/auth/me', { token })
      setUser(res.user)
      setLocked(false)
      return { ok: true }
    } catch (err) {
      if (err.status === 423) {
        setLocked(true)
        return { ok: false, locked: true }
      }
      if (err.status === 401) {
        // auto logout or invalid
        setToken('')
        setUser(null)
        setLocked(false)
      }
      return { ok: false }
    }
  }

  const login = async ({ email, password, recaptchaToken }) => {
    setLoading(true)
    try {
      const { token: t } = await api('/auth/login', {
        method: 'POST',
        body: { email, password, recaptchaToken },
      })
      setToken(t)
      await fetchMe()
      // Immediately lock session to force PIN flow
      try {
        await api('/auth/lock', { method: 'POST', token: t })
        setLocked(true)
      } catch {}
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e?.data?.error || 'login_error' }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    if (token) {
      try { await api('/auth/logout', { method: 'POST', token }) } catch {}
    }
    setToken('')
    setUser(null)
    setLocked(false)
  }

  const value = useMemo(() => ({ token, user, locked, loading, setToken, setUser, setLocked, fetchMe, login, logout }), [token, user, locked, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
