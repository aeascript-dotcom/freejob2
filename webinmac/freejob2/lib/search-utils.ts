/**
 * Search Utilities
 * 
 * Functions for smart search and tag matching
 */

import { JOB_CATEGORIES, PROVINCES, WORK_STYLES } from './mock-data'

/**
 * Get all global tags (from categories, work styles, provinces)
 */
export function getAllGlobalTags(): string[] {
  const allTags = new Set<string>()
  
  // Add category tags
  JOB_CATEGORIES.forEach(category => {
    category.tags.forEach(tag => allTags.add(tag))
  })
  
  // Add work styles
  WORK_STYLES.forEach(style => allTags.add(style))
  
  // Add provinces
  PROVINCES.forEach(province => allTags.add(province))
  
  return Array.from(allTags)
}

/**
 * Analyze search input and find matching tags
 * Returns array of tags that match the input text
 * Enhanced matching: supports partial word matching and Thai language
 */
export function analyzeSearchInput(inputText: string): string[] {
  if (!inputText || inputText.trim().length === 0) {
    return []
  }
  
  const globalTags = getAllGlobalTags()
  const matchedTags: string[] = []
  const normalizedInput = inputText.toLowerCase().trim()
  
  // Split input into words for better matching
  const inputWords = normalizedInput.split(/[\s,，、]+/).filter(w => w.length > 0)
  
  // Check each tag against the input
  globalTags.forEach(tag => {
    const normalizedTag = tag.toLowerCase()
    
    // Check multiple matching strategies:
    // 1. Exact match (input contains full tag or tag contains full input)
    if (normalizedInput.includes(normalizedTag) || normalizedTag.includes(normalizedInput)) {
      if (!matchedTags.includes(tag)) {
        matchedTags.push(tag)
      }
      return
    }
    
    // 2. Word-by-word matching (for multi-word inputs)
    const tagWords = normalizedTag.split(/[\s,，、]+/).filter(w => w.length > 0)
    
    // Check if any input word matches any tag word
    const hasWordMatch = inputWords.some(inputWord => {
      // Full word match
      if (tagWords.some(tagWord => tagWord === inputWord || tagWord.includes(inputWord) || inputWord.includes(tagWord))) {
        return true
      }
      // Partial character matching (for Thai)
      if (inputWord.length >= 2) {
        return tagWords.some(tagWord => {
          // Check if input word appears in tag word (minimum 2 characters)
          for (let i = 0; i <= tagWord.length - inputWord.length; i++) {
            if (tagWord.substring(i, i + inputWord.length) === inputWord) {
              return true
            }
          }
          return false
        })
      }
      return false
    })
    
    if (hasWordMatch && !matchedTags.includes(tag)) {
      matchedTags.push(tag)
    }
  })
  
  return matchedTags
}

/**
 * Extract new candidate terms from search input
 * Looks for:
 * 1. Terms in brackets: [รับจ้างนอน]
 * 2. Words that don't match existing tags
 */
export function extractCandidateTerms(inputText: string): string[] {
  if (!inputText || inputText.trim().length === 0) {
    return []
  }
  
  const globalTags = getAllGlobalTags()
  const candidateTerms: string[] = []
  const normalizedInput = inputText.trim()
  
  // Extract terms in brackets: [term]
  const bracketRegex = /\[([^\]]+)\]/g
  let match
  while ((match = bracketRegex.exec(normalizedInput)) !== null) {
    const term = match[1].trim()
    if (term.length > 0 && !globalTags.includes(term)) {
      candidateTerms.push(term)
    }
  }
  
  // Extract words that don't match existing tags
  // Split by spaces and common separators
  const words = normalizedInput
    .replace(/\[[^\]]+\]/g, '') // Remove bracket terms (already processed)
    .split(/[\s,，、]+/)
    .map(w => w.trim())
    .filter(w => w.length > 1) // Only words with 2+ characters
  
  words.forEach(word => {
    // Check if word doesn't match any existing tag
    const isExistingTag = globalTags.some(tag => {
      const normalizedTag = tag.toLowerCase()
      const normalizedWord = word.toLowerCase()
      return normalizedTag === normalizedWord || 
             normalizedTag.includes(normalizedWord) || 
             normalizedWord.includes(normalizedTag)
    })
    
    if (!isExistingTag && !candidateTerms.includes(word)) {
      candidateTerms.push(word)
    }
  })
  
  return candidateTerms
}
