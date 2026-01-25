/**
 * Mock Admin Functions
 * For development/testing without Supabase
 */

import type { User } from '@/types/database'

// Mock admin user
const mockAdminUser: User = {
  id: 'admin-001',
  email: 'admin@freejob.com',
  role: 'admin',
  full_name: 'Admin User',
  bio_short: 'Platform Administrator',
  bio_long: 'System administrator for Freejob platform',
  skills_tags: [],
  availability_status: 'available',
  is_duplicate_flag: false,
  stats_completed_jobs: 0,
  avatar_url: null,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
}

/**
 * Mock requireAdmin - always returns admin user
 */
export function requireAdmin(): User {
  return mockAdminUser
}

/**
 * Mock getAdminProfile
 */
export function getAdminProfile(): User | null {
  return mockAdminUser
}
