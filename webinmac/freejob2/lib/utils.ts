import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency in Thai Baht
 */
export function formatCurrency(amount: number): string {
  return `฿${amount.toLocaleString('th-TH')}`
}

/**
 * Format date in Thai locale
 */
export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  }
  return new Intl.DateTimeFormat('th-TH', defaultOptions).format(date)
}

/**
 * Format time in Thai locale (HH:mm)
 */
export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('th-TH', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

/**
 * Generate a unique ID (for client-side only)
 */
export function generateId(prefix = 'id'): string {
  if (typeof window === 'undefined') {
    return `${prefix}-${Date.now()}`
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Regulated profession keywords that require government license (ใบประกอบวิชาชีพ)
 * Used to display warnings to employers
 */
export const REGULATED_KEYWORDS = [
  "ทนาย", "Lawyer", "ว่าความ", "สืบพยาน", // Lawyer License
  "บัญชี", "Audit", "ภาษี", "ตรวจสอบบัญชี", // CPA License
  "สถาปนิก", "Architect", "วิศวกร", "เขียนแบบขออนุญาต", // Architect/Engineer License
  "ไกด์", "Guide", "นำเที่ยว", "Tour Guide", // Tour Guide License
  "แพทย์", "พยาบาล", "เภสัช", "รักษา", // Medical License
  "ขับรถ", "Driver", "คนขับรถ", // Public Transport License
  "รับทำบัญชี", "Accounting", "ยื่นภาษี", // Accounting License
  "ตรวจรับบ้าน", "Home Defect Inspection", // Engineer License
  "ประกันตัว", "Criminal Defense" // Lawyer License
]

/**
 * Check if a freelancer's skills contain regulated profession keywords
 */
export function isRegulatedProfession(skillsTags: string[]): boolean {
  if (!skillsTags || skillsTags.length === 0) return false
  
  const skillsText = skillsTags.join(' ').toLowerCase()
  return REGULATED_KEYWORDS.some(keyword => 
    skillsText.includes(keyword.toLowerCase())
  )
}
