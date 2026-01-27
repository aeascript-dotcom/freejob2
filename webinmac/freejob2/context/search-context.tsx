'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

/**
 * Search Context - Global Search State Management
 * 
 * This context provides:
 * - Selected category (single-select)
 * - Selected tags (multi-select)
 * - Search query
 * - Filter state
 * 
 * This centralizes search state so it can be shared across:
 * - Search page
 * - Advanced search modal
 * - Category navigation
 * - Filter sidebar
 */

interface SearchContextType {
  // Category selection (single-select)
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void

  // Tag selection (multi-select)
  selectedTags: string[]
  setSelectedTags: (tags: string[]) => void
  addTag: (tag: string) => void
  removeTag: (tag: string) => void
  clearTags: () => void

  // Search query
  searchQuery: string
  setSearchQuery: (query: string) => void

  // Clear all filters
  clearAllFilters: () => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

interface SearchProviderProps {
  children: ReactNode
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [selectedCategory, setSelectedCategoryState] = useState<string | null>(null)
  const [selectedTags, setSelectedTagsState] = useState<string[]>([])
  const [searchQuery, setSearchQueryState] = useState<string>('')

  const setSelectedCategory = useCallback((category: string | null) => {
    setSelectedCategoryState(category)
  }, [])

  const setSelectedTags = useCallback((tags: string[]) => {
    setSelectedTagsState(tags)
  }, [])

  const addTag = useCallback((tag: string) => {
    setSelectedTagsState((prev) => {
      if (prev.includes(tag)) {
        return prev // Already selected
      }
      return [...prev, tag]
    })
  }, [])

  const removeTag = useCallback((tag: string) => {
    setSelectedTagsState((prev) => prev.filter((t) => t !== tag))
  }, [])

  const clearTags = useCallback(() => {
    setSelectedTagsState([])
  }, [])

  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query)
  }, [])

  const clearAllFilters = useCallback(() => {
    setSelectedCategoryState(null)
    setSelectedTagsState([])
    setSearchQueryState('')
  }, [])

  const value: SearchContextType = {
    selectedCategory,
    setSelectedCategory,
    selectedTags,
    setSelectedTags,
    addTag,
    removeTag,
    clearTags,
    searchQuery,
    setSearchQuery,
    clearAllFilters,
  }

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  )
}
