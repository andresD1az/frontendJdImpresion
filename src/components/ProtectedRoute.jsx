import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, allowLocked = false }) {
  const { token, locked } = useAuth()
  const location = useLocation()

  if (!token) return <Navigate to="/login" state={{ from: location }} replace />

  // If the route allows locked sessions (e.g., /locked), only allow when actually locked.
  if (allowLocked) {
    if (!locked) return <Navigate to="/dashboard" replace />
    return children
  }

  // For normal protected routes, redirect to /locked when session is locked.
  if (locked) return <Navigate to="/locked" replace />
  return children
}
