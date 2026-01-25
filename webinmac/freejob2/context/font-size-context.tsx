'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type FontSize = 'small' | 'medium' | 'large'

interface FontSizeContextType {
  fontSize: FontSize
  setFontSize: (size: FontSize) => void
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined)

export function useFontSize() {
  const context = useContext(FontSizeContext)
  if (context === undefined) {
    throw new Error('useFontSize must be used within a FontSizeProvider')
  }
  return context
}

interface FontSizeProviderProps {
  children: ReactNode
}

const STORAGE_KEY = 'user-font-pref'

// Font size mappings
const FONT_SIZES: Record<FontSize, string> = {
  small: '100%',   // 16px base
  medium: '125%',  // 20px base
  large: '150%',   // 24px base
}

export function FontSizeProvider({ children }: FontSizeProviderProps) {
  const [fontSize, setFontSizeState] = useState<FontSize>('small')

  // Load saved preference on mount
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const saved = localStorage.getItem(STORAGE_KEY) as FontSize | null
    if (saved && ['small', 'medium', 'large'].includes(saved)) {
      setFontSizeState(saved)
      applyFontSize(saved)
    } else {
      // Default to small if nothing saved
      applyFontSize('small')
    }
  }, [])

  // Apply font size to document root
  const applyFontSize = (size: FontSize) => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.fontSize = FONT_SIZES[size]
      // Add smooth transition
      document.documentElement.style.transition = 'font-size 0.3s ease'
    }
  }

  // Update font size and save to localStorage
  const setFontSize = (size: FontSize) => {
    setFontSizeState(size)
    applyFontSize(size)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, size)
    }
  }

  // Apply font size whenever state changes
  useEffect(() => {
    applyFontSize(fontSize)
  }, [fontSize])

  const value: FontSizeContextType = {
    fontSize,
    setFontSize,
  }

  return (
    <FontSizeContext.Provider value={value}>
      {children}
    </FontSizeContext.Provider>
  )
}
