'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/types/database'
import { getCurrentUserFreelancer, updateFreelancer, initializeMockData, validateUserData } from '@/lib/freelancer-service'
import { dummyFreelancers } from '@/lib/dummy-freelancers'

interface FreelancerContextType {
  currentFreelancer: User | null
  updateProfile: (updates: Partial<User>) => Promise<void>
  refreshProfile: () => void
  loading: boolean
}

const FreelancerContext = createContext<FreelancerContextType | undefined>(undefined)

export function useFreelancer() {
  const context = useContext(FreelancerContext)
  if (context === undefined) {
    throw new Error('useFreelancer must be used within a FreelancerProvider')
  }
  return context
}

interface FreelancerProviderProps {
  children: ReactNode
}

export function FreelancerProvider({ children }: FreelancerProviderProps) {
  const [currentFreelancer, setCurrentFreelancer] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize and load profile
  const refreshProfile = () => {
    setLoading(true)
    
    // Ensure localStorage is initialized
    initializeMockData()
    
    // Try to get from localStorage
    const freelancer = getCurrentUserFreelancer()
    
    if (freelancer) {
      setCurrentFreelancer(freelancer)
    } else {
      // Fallback: Use first dummy freelancer
      const fallbackFreelancer = dummyFreelancers[0]
      if (fallbackFreelancer) {
        // Enrich with missing fields to match User interface
        const enriched: User = {
          ...fallbackFreelancer,
          province: fallbackFreelancer.province || 'กรุงเทพมหานคร',
          workStyles: fallbackFreelancer.workStyles || [],
          updated_at: fallbackFreelancer.updated_at || fallbackFreelancer.created_at,
        }
        // Validate type compliance
        if (validateUserData(enriched)) {
          setCurrentFreelancer(enriched)
        } else {
          console.error('[FreelancerContext] Invalid user data structure')
        }
      }
    }
    
    setLoading(false)
  }

  // Update profile: Update state AND save to localStorage
  const updateProfile = async (updates: Partial<User>) => {
    if (!currentFreelancer) {
      throw new Error('No freelancer profile to update')
    }

    // Update in localStorage
    const updated = updateFreelancer(currentFreelancer.id, updates)
    
    if (!updated) {
      throw new Error('Failed to update profile')
    }

    // Update state immediately (no need to wait for refresh)
    setCurrentFreelancer(updated)
  }

  // Initialize on mount
  useEffect(() => {
    refreshProfile()
  }, [])

  const value: FreelancerContextType = {
    currentFreelancer,
    updateProfile,
    refreshProfile,
    loading,
  }

  return (
    <FreelancerContext.Provider value={value}>
      {children}
    </FreelancerContext.Provider>
  )
}
