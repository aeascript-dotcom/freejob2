/**
 * Mock Admin Functions
 * For development/testing without Supabase
 */

import type { User } from '@/types/database'

// Mock admin user
// แก้ตรงนี้: ลบ : User ออก และเพิ่ม as unknown as User ท้ายปีกกา
const mockAdminUser = {
  id: 'admin-001',
  email: 'admin@freejob.com',
  role: 'admin', // ค่านี้อาจจะไม่มีใน Type User ปกติ จึงต้อง Force cast
  full_name: 'Admin User',
  bio_short: 'Platform Administrator',
  bio_long: 'System administrator for Freejob platform',
  skills_tags: [],
  availability_status: 'available',
  is_duplicate_flag: false,
  stats_completed_jobs: 0,
  avatar_url: '', // แนะนำให้แก้จาก null เป็น '' (String ว่าง) กันเหนียว
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
} as unknown as User

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
