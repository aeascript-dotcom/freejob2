'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'

const STORAGE_KEY = 'disclaimer_dismissed'
const DISMISS_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

export function DisclaimerBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return
    }

    // Check if banner was dismissed within last 24 hours
    const dismissedData = localStorage.getItem(STORAGE_KEY)
    
    if (dismissedData) {
      const dismissedTime = parseInt(dismissedData, 10)
      const now = Date.now()
      const timeSinceDismissed = now - dismissedTime
      
      // If less than 24 hours, don't show
      if (timeSinceDismissed < DISMISS_DURATION) {
        setIsVisible(false)
        return
      }
    }
    
    // Show banner if not dismissed or dismissed more than 24h ago
    setIsVisible(true)
  }, [])

  const handleDismiss = () => {
    // Save current timestamp to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, Date.now().toString())
    }
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="bg-zinc-900 border-b border-amber-500/30 py-3 px-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-amber-500 mb-1 text-thai">
              ประกาศสำคัญ (Important Notice)
            </h3>
            <p className="text-sm text-zinc-300 text-thai leading-relaxed">
              เว็บไซต์นี้เป็นเพียง <span className="font-semibold text-amber-500">พื้นที่สื่อกลาง (Matching Platform)</span> เท่านั้น{' '}
              <span className="font-semibold text-amber-500">ไม่ได้เป็นตัวกลางรับชำระเงิน</span>{' '}
              ผู้จ้างและฟรีแลนซ์โปรดตรวจสอบประวัติและตกลงราคากันเองให้รอบคอบก่อนโอนเงิน
            </p>
          </div>
          
          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-zinc-400 hover:text-white hover:bg-zinc-800 h-8 w-8 p-0 rounded-md transition-colors flex items-center justify-center"
            aria-label="ปิดประกาศ"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
