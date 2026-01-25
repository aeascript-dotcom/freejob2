/**
 * Freelancer Service - Service Layer Pattern
 * 
 * This service provides a clean abstraction layer for freelancer data operations.
 * Currently uses localStorage (MOCK), but designed for easy migration to real backend.
 * 
 * SERVICE LAYER PATTERN:
 * - UI components NEVER call localStorage directly
 * - All data operations go through this service
 * - Mock logic is clearly marked with [MOCK-ONLY] comments
 * 
 * MIGRATION GUIDE:
 * - Replace [MOCK-ONLY] sections with real API calls (e.g., Supabase)
 * - All UI components use this service, so no component changes needed
 * - Example: Replace `localStorage.setItem()` with `supabase.from('users').update()`
 * 
 * NOTE: auth-modal.tsx uses localStorage for user session (acceptable for auth mock)
 */

import { User } from '@/types/database'
import { dummyFreelancers } from './dummy-freelancers'
import { getCurrentUser } from './auth-mock'

// [MOCK-ONLY] Start - localStorage key for mock data
const STORAGE_KEY = 'freelancers'
// [MOCK-ONLY] End

/**
 * Initialize mock data in localStorage if it doesn't exist
 * 
 * [MOCK-ONLY] This function initializes mock data.
 * TODO: Remove when connecting to real database.
 */
export function initializeMockData(): void {
  // [MOCK-ONLY] Start
  if (typeof window === 'undefined') {
    return // Server-side: skip
  }

  const existing = localStorage.getItem(STORAGE_KEY)
  if (!existing) {
    // Add missing fields to dummy freelancers to match User interface
    const enrichedFreelancers = dummyFreelancers.map((f, index) => ({
      ...f,
      province: (f as any).province || 'กรุงเทพมหานคร',
      workStyles: (f as any).workStyles || [],
      hourly_rate: (f as any).hourly_rate || 500 + (index * 50), // Vary hourly rates
      updated_at: f.updated_at || f.created_at,
    }))
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enrichedFreelancers))
    console.log('[FreelancerService] Initialized mock data in localStorage', enrichedFreelancers.length, 'freelancers')
  }
  // [MOCK-ONLY] End
}

/**
 * Get all freelancers from localStorage
 * 
 * [MOCK-ONLY] This function reads from localStorage.
 * TODO: Replace with: `const { data } = await supabase.from('users').select('*').eq('role', 'freelancer')`
 */
function getAllFreelancers(): User[] {
  // [MOCK-ONLY] Start
  if (typeof window === 'undefined') {
    return []
  }

  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) {
    initializeMockData()
    return getAllFreelancers()
  }

  try {
    return JSON.parse(data) as User[]
  } catch (error) {
    console.error('[FreelancerService] Error parsing localStorage data:', error)
    initializeMockData()
    return getAllFreelancers()
  }
  // [MOCK-ONLY] End
}

/**
 * Save all freelancers to localStorage
 * 
 * [MOCK-ONLY] This function writes to localStorage.
 * TODO: Replace with batch update to real database.
 */
function saveAllFreelancers(freelancers: User[]): void {
  // [MOCK-ONLY] Start
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(freelancers))
  // [MOCK-ONLY] End
}

/**
 * Get a freelancer by ID
 * 
 * TODO: Replace with: `const { data } = await supabase.from('users').select('*').eq('id', id).single()`
 */
export function getFreelancerById(id: string): User | null {
  // [MOCK-ONLY] Start
  const freelancers = getAllFreelancers()
  return freelancers.find(f => f.id === id) || null
  // [MOCK-ONLY] End
}

/**
 * Update a freelancer by ID
 * 
 * TODO: Replace body with:
 *   const { data, error } = await supabase
 *     .from('users')
 *     .update({ ...updates, updated_at: new Date().toISOString() })
 *     .eq('id', id)
 *     .select()
 *     .single()
 *   if (error) throw error
 *   return data
 */
export function updateFreelancer(id: string, updates: Partial<User>): User | null {
  // [MOCK-ONLY] Start
  const freelancers = getAllFreelancers()
  const index = freelancers.findIndex(f => f.id === id)
  
  if (index === -1) {
    console.error(`[FreelancerService] Freelancer with ID ${id} not found`)
    return null
  }

  // Merge updates with existing data
  const updatedFreelancer: User & { hourly_rate?: number } = {
    ...freelancers[index],
    ...updates,
    updated_at: new Date().toISOString(),
  }
  
  // Preserve hourly_rate if it's being updated
  if ('hourly_rate' in updates) {
    (updatedFreelancer as any).hourly_rate = updates.hourly_rate
  }

  // Update the array
  freelancers[index] = updatedFreelancer

  // Save back to localStorage
  saveAllFreelancers(freelancers)

  console.log(`[FreelancerService] Updated freelancer ${id}:`, updates)
  return updatedFreelancer
  // [MOCK-ONLY] End
}

/**
 * Get the current logged-in user's freelancer profile
 * 
 * TODO: Replace with: `const { data } = await supabase.from('users').select('*').eq('id', currentUser.id).single()`
 */
export function getCurrentUserFreelancer(): User | null {
  const currentUser = getCurrentUser()
  
  if (!currentUser) {
    console.warn('[FreelancerService] No current user found')
    return null
  }

  // [MOCK-ONLY] Start
  // Try to find freelancer by email first
  const freelancers = getAllFreelancers()
  let freelancer = freelancers.find(f => f.email === currentUser.email)

  // If not found by email, use the first freelancer (dummy_001) for testing
  if (!freelancer) {
    freelancer = freelancers.find(f => f.id === 'dummy_001') || freelancers[0]
    console.log('[FreelancerService] Using default freelancer for testing:', freelancer?.id)
  }

  return freelancer || null
  // [MOCK-ONLY] End
}

/**
 * Upload profile image
 * 
 * Returns the image URL (currently Base64, but will be public URL in production)
 * 
 * TODO: Replace with Real File Upload (e.g., Supabase Storage) returning a public URL
 * Example:
 *   const fileExt = file.name.split('.').pop()
 *   const fileName = `${userId}-${Date.now()}.${fileExt}`
 *   const { data, error } = await supabase.storage
 *     .from('avatars')
 *     .upload(fileName, file)
 *   if (error) throw error
 *   const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName)
 *   return publicUrl
 */
export async function uploadProfileImage(file: File): Promise<string> {
  // [MOCK-ONLY] Start - Convert to Base64
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64String = reader.result as string
      resolve(base64String)
    }
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    reader.readAsDataURL(file)
  })
  // [MOCK-ONLY] End
}

/**
 * Type guard to ensure data matches User interface
 * This ensures type safety when migrating from mock to real data
 */
export function validateUserData(data: any): data is User {
  return (
    typeof data.id === 'string' &&
    typeof data.email === 'string' &&
    typeof data.role === 'string' &&
    ['client', 'freelancer', 'admin'].includes(data.role) &&
    typeof data.full_name === 'string' &&
    typeof data.province === 'string' &&
    Array.isArray(data.workStyles) &&
    Array.isArray(data.skills_tags) &&
    typeof data.availability_status === 'string' &&
    ['available', 'busy'].includes(data.availability_status) &&
    typeof data.is_duplicate_flag === 'boolean' &&
    typeof data.stats_completed_jobs === 'number' &&
    typeof data.created_at === 'string' &&
    typeof data.updated_at === 'string'
  )
}
