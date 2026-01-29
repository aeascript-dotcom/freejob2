'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react'
import { mockConnectLine, mockSendMessage } from '@/lib/line-service'

const LINE_STORAGE_KEY = 'line_connected'
const LINE_PROFILE_KEY = 'line_profile'

export interface LineProfile {
  displayName: string
  pictureUrl: string
}

export interface AdminMessage {
  id: string
  text: string
  sender: 'user' | 'admin'
  timestamp: string
}

export type LineToastType = 'success' | 'info' | 'error' | 'warning'

export const LINE_TOAST_EVENT = 'line-toast'

export function dispatchLineToast(message: string, type: LineToastType = 'info') {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(LINE_TOAST_EVENT, { detail: { message, type } }))
}

interface LineContextType {
  isLineConnected: boolean
  lineProfile: LineProfile | null
  adminMessages: AdminMessage[]
  connectLine: () => Promise<void>
  disconnectLine: () => void
  sendMessageToAdmin: (text: string) => Promise<void>
}

const LineContext = createContext<LineContextType | undefined>(undefined)

export function useLine() {
  const ctx = useContext(LineContext)
  if (ctx === undefined) {
    throw new Error('useLine must be used within a LineProvider')
  }
  return ctx
}

interface LineProviderProps {
  children: ReactNode
}

function loadStoredConnection(): { connected: boolean; profile: LineProfile | null } {
  if (typeof window === 'undefined') return { connected: false, profile: null }
  try {
    const raw = localStorage.getItem(LINE_STORAGE_KEY)
    const connected = raw === 'true'
    if (!connected) return { connected: false, profile: null }
    const prof = localStorage.getItem(LINE_PROFILE_KEY)
    const profile = prof ? (JSON.parse(prof) as LineProfile) : null
    return { connected, profile }
  } catch {
    return { connected: false, profile: null }
  }
}

function saveConnection(connected: boolean, profile: LineProfile | null) {
  if (typeof window === 'undefined') return
  localStorage.setItem(LINE_STORAGE_KEY, String(connected))
  if (profile) {
    localStorage.setItem(LINE_PROFILE_KEY, JSON.stringify(profile))
  } else {
    localStorage.removeItem(LINE_PROFILE_KEY)
  }
}

export function LineProvider({ children }: LineProviderProps) {
  const [isLineConnected, setIsLineConnected] = useState(false)
  const [lineProfile, setLineProfile] = useState<LineProfile | null>(null)
  const [adminMessages, setAdminMessages] = useState<AdminMessage[]>([])

  useEffect(() => {
    const { connected, profile } = loadStoredConnection()
    setIsLineConnected(connected)
    setLineProfile(profile)
  }, [])

  const connectLine = useCallback(async () => {
    try {
      const profile = await mockConnectLine()
      setIsLineConnected(true)
      setLineProfile(profile)
      saveConnection(true, profile)
      dispatchLineToast('เชื่อมต่อ LINE สำเร็จ', 'success')
    } catch (e) {
      console.error('[LineContext] connectLine error:', e)
      dispatchLineToast('เชื่อมต่อ LINE ไม่สำเร็จ', 'error')
    }
  }, [])

  const disconnectLine = useCallback(() => {
    setIsLineConnected(false)
    setLineProfile(null)
    setAdminMessages([])
    saveConnection(false, null)
  }, [])

  const sendMessageToAdmin = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const userMsg: AdminMessage = {
      id: `msg-${Date.now()}-user`,
      text: trimmed,
      sender: 'user',
      timestamp: new Date().toISOString(),
    }
    setAdminMessages((prev) => [...prev, userMsg])

    try {
      await mockSendMessage(trimmed)
    } catch (e) {
      console.error('[LineContext] mockSendMessage error:', e)
    }

    dispatchLineToast('ส่งข้อความแล้ว', 'info')

    const adminReply: AdminMessage = {
      id: `msg-${Date.now()}-admin`,
      text: 'แอดมินได้รับข้อความแล้ว จะรีบตอบกลับโดยเร็วที่สุด',
      sender: 'admin',
      timestamp: new Date().toISOString(),
    }
    setTimeout(() => {
      setAdminMessages((prev) => [...prev, adminReply])
    }, 2000)
  }, [])

  const value: LineContextType = {
    isLineConnected,
    lineProfile,
    adminMessages,
    connectLine,
    disconnectLine,
    sendMessageToAdmin,
  }

  return <LineContext.Provider value={value}>{children}</LineContext.Provider>
}
