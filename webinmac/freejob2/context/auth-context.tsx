'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { getCurrentUser, logout as logoutMock, login as loginMock } from '@/lib/auth-mock'

/**
 * Auth Context - Global Authentication State Management
 * 
 * This context provides:
 * - Current user state
 * - Login/logout functions
 * - Auto-sync with localStorage
 * - Session persistence
 * 
 * MIGRATION NOTE:
 * When connecting to real backend (Supabase), replace:
 * - getCurrentUser() -> supabase.auth.getUser()
 * - loginMock() -> supabase.auth.signInWithPassword()
 * - logoutMock() -> supabase.auth.signOut()
 */

interface AuthUser {
  id: string
  email: string
  name?: string
  avatar_url?: string | null
  role?: 'client' | 'freelancer' | 'admin'
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  const refreshUser = useCallback(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      const currentUser = getCurrentUser()
      if (currentUser) {
        setUser({
          id: currentUser.id || 'mock-user-id',
          email: currentUser.email || 'mock@example.com',
          name: currentUser.name || currentUser.email?.split('@')[0],
          avatar_url: currentUser.avatar_url || null,
          role: currentUser.role || 'freelancer',
        })
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('[AuthContext] Error loading user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // Login function
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      // [MOCK-ONLY] Start
      // TODO: Replace with real auth API call
      // const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      // if (error) throw error
      // setUser(data.user)
      
      const success = loginMock()
      if (success) {
        refreshUser()
      }
      return success
      // [MOCK-ONLY] End
    } catch (error) {
      console.error('[AuthContext] Login error:', error)
      return false
    }
  }, [refreshUser])

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      // [MOCK-ONLY] Start
      // TODO: Replace with real auth API call
      // await supabase.auth.signOut()
      
      logoutMock()
      setUser(null)
      // [MOCK-ONLY] End
    } catch (error) {
      console.error('[AuthContext] Logout error:', error)
    }
  }, [])

  // Initialize on mount
  useEffect(() => {
    refreshUser()

    // Listen for storage changes (e.g., login from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        refreshUser()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [refreshUser])

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
