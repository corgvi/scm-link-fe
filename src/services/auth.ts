const baseURL = import.meta.env.VITE_BASE_URL

export function getToken(): string | null {
  return localStorage.getItem('auth_token')
}
export function setToken(token: string | null) {
  if (token) localStorage.setItem('auth_token', token)
  else localStorage.removeItem('auth_token')
}
export function getRefreshToken(): string | null {
  return localStorage.getItem('refresh_token')
}
export function setRefreshToken(rt: string | null) {
  if (rt) localStorage.setItem('refresh_token', rt)
  else localStorage.removeItem('refresh_token')
}
export function setUserInfo(info: any | null) {
  if (info) localStorage.setItem('user_info', JSON.stringify(info))
  else localStorage.removeItem('user_info')
}

export async function login(username: string, password: string) {
  const res = await fetch(`${baseURL}/scmlink/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  const data = await res.json()
  if (res.ok && data?.code === 1000 && data.result) {
    setToken(data.result.token)
    setRefreshToken(data.result.refreshToken)
    return data.result
  }
  throw data
}

export async function refreshTokenRequest(refreshToken: string) {
  const res = await fetch(`${baseURL}/scmlink/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: refreshToken }),
  })
  const data = await res.json()
  if (res.ok && data?.code === 1000 && data.result) {
    setToken(data.result.token)
    // some APIs return a new refresh token
    if (data.result.refreshToken) setRefreshToken(data.result.refreshToken)
    return data.result
  }
  throw data
}

export async function introspect(token: string) {
  const res = await fetch(`${baseURL}/scmlink/auth/introspect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
  const data = await res.json()
  return data
}

/**
 * fetch wrapper that injects Authorization header and tries refresh on 401 once
 */
export async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}) {
  const token = getToken()
  const headers = new Headers(init.headers || {})
  if (token) headers.set('Authorization', `Bearer ${token}`)
  headers.set('Content-Type', headers.get('Content-Type') || 'application/json')
  const res = await fetch(input, { ...init, headers })

  if (res.status === 401) {
    const rt = getRefreshToken()
    if (!rt) return res
    try {
      await refreshTokenRequest(rt)
      const newToken = getToken()
      const headers2 = new Headers(init.headers || {})
      if (newToken) headers2.set('Authorization', `Bearer ${newToken}`)
      headers2.set('Content-Type', headers2.get('Content-Type') || 'application/json')
      return await fetch(input, { ...init, headers: headers2 })
    } catch (e) {
      // refresh failed
      setToken(null)
      setRefreshToken(null)
      throw e
    }
  }

  return res
}

export async function logout(token?: string) {
  const payloadToken = token || getToken() || getRefreshToken()
  if (!payloadToken) {
    // nothing to do
    setToken(null)
    setRefreshToken(null)
    setUserInfo(null)
    return { code: 1000, result: null }
  }

  try {
    const res = await fetch(`${baseURL}/scmlink/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: payloadToken }),
    })
    const data = await res.json()
    // on success clear local storage
    if (data?.code === 1000) {
      setToken(null)
      setRefreshToken(null)
      setUserInfo(null)
    }
    return data
  } catch (err) {
    // best-effort cleanup on network error
    setToken(null)
    setRefreshToken(null)
    setUserInfo(null)
    throw err
  }
}