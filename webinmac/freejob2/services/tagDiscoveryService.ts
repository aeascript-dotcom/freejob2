/**
 * Tag Discovery Service
 * 
 * Manages new tag discovery and threshold checking using localStorage
 * to simulate a database for crowd-sourcing new tags.
 */

const STORAGE_KEY = 'pending_tags'
// TESTING MODE: Set to 3 for quick testing. Change to 50 for production.
const THRESHOLD = 3
// PRODUCTION: const THRESHOLD = 50

export interface PendingTags {
  [term: string]: number
}

/**
 * Get all pending tags from localStorage
 */
export function getPendingTags(): PendingTags {
  if (typeof window === 'undefined') return {}
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Error reading pending tags:', error)
    return {}
  }
}

/**
 * Save pending tags to localStorage
 */
function savePendingTags(tags: PendingTags): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tags))
  } catch (error) {
    console.error('Error saving pending tags:', error)
  }
}

/**
 * Increment count for a candidate term
 * Returns true if threshold is reached (should notify admin)
 */
export function incrementCandidateTerm(term: string): boolean {
  const pendingTags = getPendingTags()
  const currentCount = pendingTags[term] || 0
  const newCount = currentCount + 1
  
  pendingTags[term] = newCount
  savePendingTags(pendingTags)
  
  // Check if threshold is reached
  if (newCount >= THRESHOLD) {
    return true
  }
  
  return false
}

/**
 * Get count for a specific term
 */
export function getTermCount(term: string): number {
  const pendingTags = getPendingTags()
  return pendingTags[term] || 0
}

/**
 * Clear a term from pending tags (when admin approves/rejects)
 */
export function clearTerm(term: string): void {
  const pendingTags = getPendingTags()
  delete pendingTags[term]
  savePendingTags(pendingTags)
}

/**
 * Clear all pending tags (for testing/reset)
 */
export function clearAllPendingTags(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Notify admin about a new tag candidate
 * In production, this would send to an admin API/notification system
 */
export function notifyAdmin(term: string, count: number): void {
  // Trigger custom event for UI to listen
  // In production, this would send to an admin API/notification system
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('tag-discovery-threshold', {
      detail: { term, count }
    }))
  }
}
