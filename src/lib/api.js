const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export async function api(path, { method = 'GET', body, token, headers = {} } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  // If session locked, bubble status for UI to handle
  if (!res.ok) {
    const err = { status: res.status, data: null }
    try { err.data = await res.json() } catch {}
    throw err
  }
  try {
    return await res.json()
  } catch {
    return null
  }
}
