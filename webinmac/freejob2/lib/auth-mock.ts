'use client'

export function login(): boolean {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify({
      id: 'mock-user-id',
      email: 'mock@example.com',
      name: 'Mock User'
    }))
    return true
  }
  return false
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user')
  }
}

export function getCurrentUser() {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }
  }
  return null
}

export function requireAuth() {
  const user = getCurrentUser()
  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }
  return user
}
