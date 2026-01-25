'use client'

import { useEffect } from 'react'
import { initializeMockData } from '@/lib/freelancer-service'

/**
 * Client component to initialize mock data in localStorage
 * This runs once when the app loads
 */
export function MockDataInitializer() {
  useEffect(() => {
    initializeMockData()
  }, [])

  return null // This component doesn't render anything
}
