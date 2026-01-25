'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Navbar } from '@/components/navbar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FreelancerCard } from '@/components/freelancer-card'
import { SearchSidebar } from '@/components/search-sidebar'
import { mockFreelancers, JOB_CATEGORIES, PROVINCES, WORK_STYLES } from '@/lib/mock-data'
import { getCurrentUser } from '@/lib/auth-mock'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Search, X } from 'lucide-react'
import { AdvancedSearchModal } from '@/components/search/advanced-search-modal'
import { analyzeSearchInput, extractCandidateTerms } from '@/lib/search-utils'
import { incrementCandidateTerm, notifyAdmin } from '@/services/tagDiscoveryService'
import { ToastContainer } from '@/components/toast'
import { GridBackground, SeparatorBold } from '@/components/graphic-elements'
import { RightStatsSidebar } from '@/components/right-stats-sidebar'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  // Convert MockFreelancer to User type
  const [freelancers, setFreelancers] = useState(() => 
    mockFreelancers.map(f => ({
      id: f.id,
      email: f.email,
      role: f.role as 'client' | 'freelancer' | 'admin',
      full_name: f.full_name,
      bio_short: f.bio_short || null,
      bio_long: f.bio || null,
      province: f.province,
      workStyles: f.work_style_tags,
      skills_tags: f.skills_tags,
      availability_status: f.availability_status,
      is_duplicate_flag: false,
      stats_completed_jobs: f.stats_completed_jobs,
      avatar_url: f.avatar_url || null,
      created_at: f.created_at,
      updated_at: f.created_at
    }))
  )
  const [categories, setCategories] = useState(JOB_CATEGORIES)
  
  // Separate manual tags (clicked by user) and auto tags (matched by search)
  const [manualSelectedTags, setManualSelectedTags] = useState<string[]>([])
  const [autoSelectedTags, setAutoSelectedTags] = useState<string[]>([])
  
  // Combined selected tags for filtering (manual + auto)
  const selectedTags = useMemo(() => {
    return [...manualSelectedTags, ...autoSelectedTags]
  }, [manualSelectedTags, autoSelectedTags])
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null) // Single category ID
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([])
  const [selectedWorkStyles, setSelectedWorkStyles] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [selectedFreelancers, setSelectedFreelancers] = useState<Set<string>>(new Set())
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)
  const [quoteDescription, setQuoteDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type?: 'info' | 'success' | 'warning' | 'error' }>>([])
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false)

  // Store all available tags (never changes) - exclude work styles and provinces
  const [allAvailableTags] = useState(() => {
    const allTags = new Set<string>()
    mockFreelancers.forEach(f => {
      f.skills_tags?.forEach(tag => {
        // Only add tags that are not work styles or provinces
        if (!WORK_STYLES.includes(tag) && !PROVINCES.includes(tag)) {
          allTags.add(tag)
        }
      })
    })
    JOB_CATEGORIES.forEach(c => c.tags?.forEach(tag => allTags.add(tag)))
    return Array.from(allTags)
  })

  // Compute visible tags based on selected category and search query
  const visibleTags = useMemo(() => {
    // Base tags to filter from (either from search query or all tags)
    const baseTags = availableTags.length > 0 ? availableTags : allAvailableTags

    // Scenario C: No category selected - show all base tags
    if (!selectedCategory) {
      return baseTags
    }

    // Scenario A & B: Category selected - show only tags from selected category
    const category = JOB_CATEGORIES.find(c => c.id === selectedCategory)
    if (!category) {
      return baseTags
    }

    const categoryTags = new Set<string>(category.tags)

    // Filter to only show tags that exist in baseTags AND belong to selected category
    return baseTags.filter(tag => categoryTags.has(tag))
  }, [selectedCategory, allAvailableTags, availableTags])

  // Debounced search query for performance
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  
  // Debounce search query (300ms delay)
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300) // 300ms debounce

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [searchQuery])

  // Handle smart search - Real-time tag matching based on search query
  useEffect(() => {
    const inputText = debouncedSearchQuery.trim()
    
    // If search query is empty: Clear auto-selected tags
    if (!inputText || inputText.length === 0) {
      setAutoSelectedTags([])
      setAvailableTags(allAvailableTags)
      return
    }

    // 1. Auto-tag matching - REPLACE (not append) auto-selected tags
    const matchedTags = analyzeSearchInput(inputText)
    console.log('🔍 Search Input:', inputText)
    console.log('✅ Matched Tags:', matchedTags)
    
    // CRITICAL FIX: Replace auto-selected tags instead of appending
    setAutoSelectedTags(matchedTags)
    console.log('✨ Auto-selected tags (replaced):', matchedTags)

    // 2. Tag discovery - extract candidate terms
    const candidateTerms = extractCandidateTerms(inputText)
    candidateTerms.forEach(term => {
      const reachedThreshold = incrementCandidateTerm(term)
      if (reachedThreshold) {
        const count = 3 // TESTING: Change to 50 in production
        notifyAdmin(term, count)
        
        // Show toast notification
        const toastId = `toast-${Date.now()}-${Math.random()}`
        setToasts(prev => [...prev, {
          id: toastId,
          message: `📢 แจ้งเตือน Admin: คำค้นหาใหม่ "${term}" ถูกค้นหา ${count} ครั้งแล้ว!`,
          type: 'warning'
        }])
      }
    })

    // Update available tags for display (filtered by search query)
    const words = inputText.toLowerCase().split(/[\s,，、]+/).filter(w => w.length > 0)
    const filteredTags = allAvailableTags.filter(tag => 
      words.some(word => tag.toLowerCase().includes(word) || word.includes(tag.toLowerCase()))
    )
    setAvailableTags(filteredTags.length > 0 ? filteredTags : allAvailableTags)
  }, [debouncedSearchQuery, allAvailableTags])

  // Listen for threshold events
  useEffect(() => {
    const handleThresholdEvent = (event: CustomEvent) => {
      const { term, count } = event.detail
      const toastId = `toast-${Date.now()}-${Math.random()}`
      setToasts(prev => [...prev, {
        id: toastId,
        message: `📢 แจ้งเตือน Admin: คำค้นหาใหม่ "${term}" ถูกค้นหา ${count} ครั้งแล้ว!`,
        type: 'warning'
      }])
    }

    window.addEventListener('tag-discovery-threshold', handleThresholdEvent as EventListener)
    return () => {
      window.removeEventListener('tag-discovery-threshold', handleThresholdEvent as EventListener)
    }
  }, [])

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(prev => {
      // Single-select logic: if clicking the same category, deselect it
      // Otherwise, select the new category (replacing any previous selection)
      if (prev === categoryId) {
        // Deselecting - clear tags that belong only to this category
        const deselectedCategory = JOB_CATEGORIES.find(c => c.id === categoryId)
        if (deselectedCategory) {
          const categoryTags = new Set<string>(deselectedCategory.tags)
          // Remove tags that belong to the deselected category
          setManualSelectedTags(prevTags => 
            prevTags.filter(tag => !categoryTags.has(tag))
          )
          setAutoSelectedTags(prevTags => 
            prevTags.filter(tag => !categoryTags.has(tag))
          )
        }
        return null
      } else {
        // Selecting new category - keep current tags (they might belong to multiple categories)
        return categoryId
      }
    })
  }

  const handleAdvancedSearchApply = (tags: string[]) => {
    // Apply tags from advanced search modal
    // Clear auto-selected tags and set manual tags
    setAutoSelectedTags([])
    setManualSelectedTags(tags)
    // Clear category selection when using advanced search
    setSelectedCategory(null)
  }

  const handleTagClick = (tag: string) => {
    // Handle manual tag selection (separate from auto-selected)
    const isAutoSelected = autoSelectedTags.includes(tag)
    const isManuallySelected = manualSelectedTags.includes(tag)
    
    if (isAutoSelected) {
      // If clicking an auto-selected tag, move it to manual selection
      setAutoSelectedTags(prev => prev.filter(t => t !== tag))
      setManualSelectedTags(prev => 
        prev.includes(tag) ? prev : [...prev, tag]
      )
    } else if (isManuallySelected) {
      // Remove from manual selection
      setManualSelectedTags(prev => prev.filter(t => t !== tag))
    } else {
      // Add to manual selection
      setManualSelectedTags(prev => [...prev, tag])
    }
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const handleProvinceClick = (province: string) => {
    setSelectedProvinces(prev => 
      prev.includes(province) 
        ? prev.filter(p => p !== province)
        : [...prev, province]
    )
  }

  const handleWorkStyleClick = (style: string) => {
    setSelectedWorkStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style)
        : [...prev, style]
    )
  }

  const handleFreelancerSelect = (id: string) => {
    setSelectedFreelancers(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleRequestQuote = async () => {
    if (selectedFreelancers.size === 0) return

    const user = getCurrentUser()
    if (!user) {
      alert('กรุณาเข้าสู่ระบบก่อน')
      return
    }

    alert(`ส่งคำขอใบเสนอราคาไปยัง ${selectedFreelancers.size} ฟรีแลนซ์เรียบร้อยแล้ว (Mock)`)
    setIsQuoteModalOpen(false)
    setQuoteDescription('')
    setSelectedFreelancers(new Set())
  }

  // Memoized filtered freelancers for performance
  const filteredFreelancers = useMemo(() => {
    return freelancers.filter(f => {
    // Filter by selected category (HIGHEST PRIORITY)
    if (selectedCategory) {
      const category = JOB_CATEGORIES.find(c => c.id === selectedCategory)
      if (category) {
        const categoryTags = new Set<string>(category.tags)

        // Check if freelancer has at least one tag from selected category
        // IMPORTANT: Only check skills_tags, exclude work_style_tags and provinces
        const relevantTags = f.skills_tags.filter(tag => 
          !WORK_STYLES.includes(tag) && !PROVINCES.includes(tag)
        )
        const hasMatchingCategoryTag = relevantTags.some(tag => categoryTags.has(tag))
        if (!hasMatchingCategoryTag) {
          return false
        }
      }
    }

    // Filter by provinces
    if (selectedProvinces.length > 0) {
      const freelancerProvince = f.province
      if (!freelancerProvince || !selectedProvinces.includes(freelancerProvince)) {
        return false
      }
    }

    // Filter by work styles
    if (selectedWorkStyles.length > 0) {
      const freelancerWorkStyles = f.workStyles || []
      const hasMatchingWorkStyle = selectedWorkStyles.some(style => 
        freelancerWorkStyles.includes(style) || f.skills_tags.includes(style)
      )
      if (!hasMatchingWorkStyle) {
        return false
      }
    }

    // Filter by tags (category tags) - only if no category is selected
    // If category is selected, tags are already filtered by category
    if (selectedTags.length > 0 && !selectedCategory) {
      const hasMatchingTag = selectedTags.some(tag => f.skills_tags.includes(tag))
      if (!hasMatchingTag) {
        return false
      }
    }

    // If both category and tags are selected, freelancer must match both
    if (selectedTags.length > 0 && selectedCategory) {
      const hasMatchingTag = selectedTags.some(tag => f.skills_tags.includes(tag))
      if (!hasMatchingTag) {
        return false
      }
    }

    return true
    })
  }, [freelancers, selectedCategory, selectedProvinces, selectedWorkStyles, selectedTags])

  return (
    <div className="min-h-screen bg-background relative">
      <GridBackground />
      <Navbar />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-6">
          <h1 className="text-5xl mb-4 heading-english" style={{ color: 'hsl(var(--accent))' }}>ค้นหาฟรีแลนซ์</h1>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mb-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="ค้นหาด้วยคำค้นหา เช่น 'ออกแบบ', 'เขียนโปรแกรม', 'แปลภาษา'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
              style={{
                borderColor: 'rgba(255, 50, 0, 0.3)'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  // Auto-selected tags will be cleared automatically by useEffect
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Show matched tags count indicator - moved outside search bar container */}
          {autoSelectedTags.length > 0 && (
            <div className="max-w-2xl mb-4 px-1">
              <div className="text-xs text-muted-foreground text-thai flex items-center gap-1 flex-wrap">
                <span className="text-accent font-semibold">✨</span>
                <span>พบ {autoSelectedTags.length} แท็กที่ตรงกัน:</span>
                <span className="font-bold text-accent">{autoSelectedTags.slice(0, 3).join(', ')}</span>
                {autoSelectedTags.length > 3 && <span>...</span>}
              </div>
            </div>
          )}

          {/* Category Buttons - Large Single-Select */}
          <div className="flex flex-wrap gap-4 mt-4 items-center">
            {categories.map(category => {
              const isSelected = selectedCategory === category.id
              return (
                <Button
                  key={category.id}
                  variant={isSelected ? 'default' : 'outline'}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`
                    text-lg px-8 py-4 font-semibold transition-all duration-200 text-thai
                    ${isSelected 
                      ? 'bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-gray-900 border-2 border-yellow-600 shadow-lg scale-105 ring-2 ring-yellow-300 ring-offset-2' 
                      : 'bg-white hover:bg-gray-100 active:bg-gray-200 text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:shadow-md hover:scale-102'
                    }
                  `}
                >
                  {category.name}
                </Button>
              )
            })}
            {/* Advanced Search Button */}
            <Button
              variant="outline"
              onClick={() => setIsAdvancedSearchOpen(true)}
              className="text-lg px-6 py-4 font-semibold transition-all duration-200 text-thai border-2 border-amber-500 text-amber-600 hover:bg-amber-50 hover:border-amber-600 hover:shadow-md"
            >
              <Search className="w-5 h-5 mr-2" />
              ค้นหาแบบละเอียด
            </Button>
          </div>
        </div>

        {/* 3-Column Layout: Left Sidebar (20%) - Center Grid (60%) - Right Stats (20%) */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Left Filter Sidebar - 20% */}
          <aside className="lg:col-span-2">
            <div className="sticky top-24">
              <SearchSidebar
                tags={visibleTags}
                selectedTags={selectedTags}
                selectedCategories={selectedCategory ? [selectedCategory] : []}
                selectedProvinces={selectedProvinces}
                selectedWorkStyles={selectedWorkStyles}
                autoSelectedTags={autoSelectedTags}
                onTagClick={handleTagClick}
                onCategoryClick={handleCategoryClick}
                onProvinceClick={handleProvinceClick}
                onWorkStyleClick={handleWorkStyleClick}
              />
            </div>
          </aside>

          {/* Main Content - 60% */}
          <main className="lg:col-span-6">
            {selectedFreelancers.size > 0 && (
              <div className="mb-4 p-4 bg-card border border-border rounded-lg flex items-center justify-between">
                <span className="text-sm font-medium text-card-foreground text-thai">
                  เลือกแล้ว {selectedFreelancers.size} คน
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedFreelancers(new Set())}
                    className="text-thai"
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsQuoteModalOpen(true)}
                    className="text-thai"
                  >
                    ขอใบเสนอราคา
                  </Button>
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12 text-foreground text-thai">กำลังโหลด...</div>
            ) : filteredFreelancers.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="text-foreground text-thai text-lg font-semibold">
                  ไม่พบฟรีแลนซ์ที่คุณต้องการ
                </div>
                <div className="text-muted-foreground text-thai text-sm mb-4">
                  ลองปรับเงื่อนไขการค้นหาหรือติดต่อแอดมินเพื่อขอความช่วยเหลือ
                </div>
                <Button
                  onClick={() => {
                    window.alert("ระบบได้รับความต้องการของคุณแล้ว แอดมินจะรีบจัดหาให้ครับ!")
                    console.log('Admin notification:', {
                      searchQuery,
                      selectedTags,
                      selectedCategory: selectedCategory,
                      selectedProvinces,
                      selectedWorkStyles,
                      timestamp: new Date().toISOString()
                    })
                  }}
                  variant="outline"
                  className="text-thai"
                >
                  ฝากความต้องการถึงแอดมิน
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-4">
                {filteredFreelancers.map(freelancer => (
                  <FreelancerCard
                    key={freelancer.id}
                    freelancer={freelancer}
                    isSelected={selectedFreelancers.has(freelancer.id)}
                    onSelect={handleFreelancerSelect}
                    showCheckbox={selectedFreelancers.size > 0 || true}
                  />
                ))}
              </div>
            )}
          </main>

          {/* Right Stats Sidebar - 20% */}
          <aside className="lg:col-span-2 hidden lg:block">
            <div className="sticky top-24">
              <RightStatsSidebar />
            </div>
          </aside>
        </div>
      </div>

      {/* Quote Request Modal */}
      <Dialog open={isQuoteModalOpen} onOpenChange={setIsQuoteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-card-foreground heading-glow">ขอใบเสนอราคา</DialogTitle>
            <DialogDescription className="text-thai">
              ส่งคำขอใบเสนอราคาไปยังฟรีแลนซ์ที่เลือก
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-thai">
              คุณกำลังส่งคำขอไปยัง {selectedFreelancers.size} ฟรีแลนซ์
            </p>
            <div>
              <label className="text-sm font-medium mb-2 block text-card-foreground text-thai" style={{ color: 'hsl(var(--accent))' }}>
                รายละเอียดงาน
              </label>
              <Textarea
                value={quoteDescription}
                onChange={(e) => setQuoteDescription(e.target.value)}
                placeholder="อธิบายรายละเอียดงานที่ต้องการ..."
                rows={6}
                className="text-thai"
                style={{
                  borderColor: 'hsl(var(--accent))'
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsQuoteModalOpen(false)}
              >
                ยกเลิก
              </Button>
              <Button
                onClick={handleRequestQuote}
                disabled={!quoteDescription.trim()}
              >
                ส่งคำขอ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Advanced Search Modal */}
      <AdvancedSearchModal
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
        onApplyTags={handleAdvancedSearchApply}
        initialSelectedTags={[...manualSelectedTags, ...autoSelectedTags]}
      />
    </div>
  )
}
