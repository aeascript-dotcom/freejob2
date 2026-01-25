/**
 * Mock Job Categories Data
 * For development/testing without Supabase
 */

import type { JobCategory } from '@/types/database'

// Mock categories data
let mockCategories: JobCategory[] = [
  {
    id: 'cat_001',
    name: 'กราฟิกและดีไซน์',
    slug: 'design',
    tags: ['Logo Design', 'Banner', 'Packaging', 'UX/UI', 'Illustrator'],
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'cat_002',
    name: 'การตลาดและโฆษณา',
    slug: 'marketing',
    tags: ['Facebook Ads', 'SEO', 'Content Writing', 'Influencer', 'TikTok'],
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'cat_003',
    name: 'เว็บไซต์และโปรแกรมมิ่ง',
    slug: 'tech',
    tags: ['Web Dev', 'Mobile App', 'WordPress', 'Frontend', 'Backend'],
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'cat_004',
    name: 'วิดีโอและเสียง',
    slug: 'video-audio',
    tags: ['Video Editing', 'Voice Over', 'Motion Graphic', 'Sound Engineer'],
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'cat_005',
    name: 'บ้านและที่อยู่อาศัย',
    slug: 'home-living',
    tags: ['ช่างประปา', 'ล้างแอร์', 'เดินไฟ', 'ทำความสะอาด', 'ตกแต่งภายใน'],
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'cat_006',
    name: 'ไลฟ์สไตล์',
    slug: 'lifestyle',
    tags: ['ดูดวง', 'เทรนเนอร์', 'ช่างแต่งหน้า', 'ไกด์', 'พี่เลี้ยงเด็ก'],
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  },
]

/**
 * Get all categories
 */
export function getMockCategories(): JobCategory[] {
  return [...mockCategories]
}

/**
 * Get category by ID
 */
export function getMockCategoryById(id: string): JobCategory | null {
  return mockCategories.find(cat => cat.id === id) || null
}

/**
 * Create new category
 */
export function createMockCategory(data: Omit<JobCategory, 'id' | 'created_at' | 'updated_at'>): JobCategory {
  const newCategory: JobCategory = {
    ...data,
    id: `cat_${String(mockCategories.length + 1).padStart(3, '0')}`,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  }
  mockCategories.push(newCategory)
  return newCategory
}

/**
 * Update category
 */
export function updateMockCategory(id: string, data: Partial<Omit<JobCategory, 'id' | 'created_at'>>): JobCategory | null {
  const index = mockCategories.findIndex(cat => cat.id === id)
  if (index === -1) return null

  mockCategories[index] = {
    ...mockCategories[index],
    ...data,
    updated_at: new Date().toISOString(),
  }
  return mockCategories[index]
}

/**
 * Delete category
 */
export function deleteMockCategory(id: string): boolean {
  const index = mockCategories.findIndex(cat => cat.id === id)
  if (index === -1) return false

  mockCategories.splice(index, 1)
  return true
}

/**
 * Reset to initial data
 */
export function resetMockCategories() {
  mockCategories = [
    {
      id: 'cat_001',
      name: 'กราฟิกและดีไซน์',
      slug: 'design',
      tags: ['Logo Design', 'Banner', 'Packaging', 'UX/UI', 'Illustrator'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'cat_002',
      name: 'การตลาดและโฆษณา',
      slug: 'marketing',
      tags: ['Facebook Ads', 'SEO', 'Content Writing', 'Influencer', 'TikTok'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'cat_003',
      name: 'เว็บไซต์และโปรแกรมมิ่ง',
      slug: 'tech',
      tags: ['Web Dev', 'Mobile App', 'WordPress', 'Frontend', 'Backend'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'cat_004',
      name: 'วิดีโอและเสียง',
      slug: 'video-audio',
      tags: ['Video Editing', 'Voice Over', 'Motion Graphic', 'Sound Engineer'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'cat_005',
      name: 'บ้านและที่อยู่อาศัย',
      slug: 'home-living',
      tags: ['ช่างประปา', 'ล้างแอร์', 'เดินไฟ', 'ทำความสะอาด', 'ตกแต่งภายใน'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'cat_006',
      name: 'ไลฟ์สไตล์',
      slug: 'lifestyle',
      tags: ['ดูดวง', 'เทรนเนอร์', 'ช่างแต่งหน้า', 'ไกด์', 'พี่เลี้ยงเด็ก'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]
}
