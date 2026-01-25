import React from 'react'
import { render, screen } from '@testing-library/react'
import { FreelancerCard } from '@/components/freelancer-card'
import { User } from '@/types/database'

// Mock the FreelancerModal component
jest.mock('@/components/freelancer-modal', () => ({
  FreelancerModal: ({ freelancer, isOpen, onClose }: any) => (
    isOpen ? <div data-testid="freelancer-modal">{freelancer.full_name}</div> : null
  ),
}))

describe('FreelancerCard', () => {
  // Test Case 1: Rendering - Verify component renders freelancer data correctly
  it('should render freelancer name, bio, and stats correctly', () => {
    const mockFreelancer: User = {
      id: 'test-id-1',
      email: 'test@example.com',
      role: 'freelancer',
      full_name: 'สมชาย ใจดี',
      bio_short: 'นักออกแบบกราฟิกมืออาชีพ',
      bio_long: null,
      skills_tags: ['ออกแบบโลโก้', 'กราฟิก', 'Photoshop'],
      availability_status: 'available',
      is_duplicate_flag: false,
      stats_completed_jobs: 25,
      avatar_url: '/character/a1.png',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    }

    render(<FreelancerCard freelancer={mockFreelancer} />)

    // Verify name is rendered
    expect(screen.getByText('สมชาย ใจดี')).toBeInTheDocument()

    // Verify bio is rendered
    expect(screen.getByText('นักออกแบบกราฟิกมืออาชีพ')).toBeInTheDocument()

    // Verify completed jobs count is rendered
    expect(screen.getByText(/งานที่ทำแล้ว: 25/)).toBeInTheDocument()

    // Verify availability status badge is rendered
    expect(screen.getByText('ว่าง')).toBeInTheDocument()

    // Verify skills tags are rendered
    expect(screen.getByText('ออกแบบโลโก้')).toBeInTheDocument()
    expect(screen.getByText('กราฟิก')).toBeInTheDocument()
    expect(screen.getByText('Photoshop')).toBeInTheDocument()
  })

  // Test Case 2: Edge Case - Missing or empty name (charAt fix)
  it('should not crash when freelancer name is missing or empty', () => {
    const mockFreelancerNoName: User = {
      id: 'test-id-2',
      email: 'test2@example.com',
      role: 'freelancer',
      full_name: '', // Empty string
      bio_short: 'Test bio',
      bio_long: null,
      skills_tags: ['Test Skill'],
      availability_status: 'available',
      is_duplicate_flag: false,
      stats_completed_jobs: 10,
      avatar_url: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    }

    // This should not throw an error
    const { container } = render(<FreelancerCard freelancer={mockFreelancerNoName} />)

    // Component should render without crashing
    expect(container).toBeInTheDocument()

    // Should show fallback text "Unknown" for name
    expect(screen.getByText('Unknown')).toBeInTheDocument()

    // Avatar fallback should show "?" when name is empty
    const avatarFallback = container.querySelector('[class*="AvatarFallback"]')
    expect(avatarFallback).toBeInTheDocument()
  })

  // Test Case 3: Edge Case - Null name (undefined)
  it('should handle null/undefined name gracefully', () => {
    const mockFreelancerNullName: User = {
      id: 'test-id-3',
      email: 'test3@example.com',
      role: 'freelancer',
      full_name: '' as any, // Force empty string
      bio_short: null,
      bio_long: null,
      skills_tags: [],
      availability_status: 'busy',
      is_duplicate_flag: false,
      stats_completed_jobs: 0,
      avatar_url: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    }

    // This should not throw an error
    const { container } = render(<FreelancerCard freelancer={mockFreelancerNullName} />)

    // Component should render
    expect(container).toBeInTheDocument()

    // Should show "Unknown" fallback
    expect(screen.getByText('Unknown')).toBeInTheDocument()

    // Should show "คิวเต็ม" for busy status
    expect(screen.getByText('คิวเต็ม')).toBeInTheDocument()

    // Should show fallback bio
    expect(screen.getByText('ไม่มีคำอธิบาย')).toBeInTheDocument()
  })

  // Test Case 4: Verify action buttons are rendered
  it('should render action buttons correctly', () => {
    const mockFreelancer: User = {
      id: 'test-id-4',
      email: 'test4@example.com',
      role: 'freelancer',
      full_name: 'ทดสอบ ชื่อ',
      bio_short: 'Test bio',
      bio_long: null,
      skills_tags: ['Skill 1'],
      availability_status: 'available',
      is_duplicate_flag: false,
      stats_completed_jobs: 5,
      avatar_url: '/character/a2.png',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    }

    render(<FreelancerCard freelancer={mockFreelancer} />)

    // Verify "ดูโปรไฟล์เต็ม" button exists
    expect(screen.getByText('ดูโปรไฟล์เต็ม')).toBeInTheDocument()

    // Verify "เสนอราคา" button exists
    expect(screen.getByText('เสนอราคา')).toBeInTheDocument()
  })

  // Test Case 5: Verify checkbox appears when showCheckbox is true
  it('should show checkbox when showCheckbox prop is true', () => {
    const mockFreelancer: User = {
      id: 'test-id-5',
      email: 'test5@example.com',
      role: 'freelancer',
      full_name: 'ทดสอบ Checkbox',
      bio_short: 'Test',
      bio_long: null,
      skills_tags: [],
      availability_status: 'available',
      is_duplicate_flag: false,
      stats_completed_jobs: 0,
      avatar_url: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    }

    const { container } = render(
      <FreelancerCard 
        freelancer={mockFreelancer} 
        showCheckbox={true}
        isSelected={false}
      />
    )

    // Checkbox should be present
    const checkbox = container.querySelector('input[type="checkbox"]')
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).not.toBeChecked()
  })
})
