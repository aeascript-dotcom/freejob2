'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Navbar } from '@/components/navbar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FreelancerCard } from '@/components/freelancer-card'
import { SearchSidebar } from '@/components/search-sidebar'
import { mockFreelancers, JOB_CATEGORIES, PROVINCES, WORK_STYLES } from '@/lib/mock-data'
import { getCurrentUser } from '@/lib/auth-mock'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Search, X } from 'lucide-react'
import { analyzeSearchInput, extractCandidateTerms } from '@/lib/search-utils'
import { incrementCandidateTerm, notifyAdmin } from '@/services/tagDiscoveryService'
import { ToastContainer } from '@/components/toast'
import { GridBackground, SeparatorBold } from '@/components/graphic-elements'
import { RightStatsSidebar } from '@/components/right-stats-sidebar'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [freelancers, setFreelancers] = useState(mockFreelancers)
  const [categories, setCategories] = useState(JOB_CATEGORIES)
  
  // Separate manual tags (clicked by user) and auto tags (matched by search)
  const [manualSelectedTags, setManualSelectedTags] = useState<string[]>([])
  const [autoSelectedTags, setAutoSelectedTags] = useState<string[]>([])
  
  // Combined selected tags for filtering (manual + auto)
  const selectedTags = useMemo(() => {
    return [...manualSelectedTags, ...autoSelectedTags]
  }, [manualSelectedTags, autoSelectedTags])
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]) // Category IDs
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([])
  const [selectedWorkStyles, setSelectedWorkStyles] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [selectedFreelancers, setSelectedFreelancers] = useState<Set<string>>(new Set())
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)
  const [quoteDescription, setQuoteDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type?: 'info' | 'success' | 'warning' | 'error' }>>([])
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

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

  // Compute visible tags based on selected categories and search query
  const visibleTags = useMemo(() => {
    // Base tags to filter from (either from search query or all tags)
    const baseTags = availableTags.length > 0 ? availableTags : allAvailableTags

    // Scenario C: No category selected - show all base tags
    if (selectedCategories.length === 0) {
      return baseTags
    }

    // Scenario A & B: Category selected - show only tags from selected categories
    const categoryTags = new Set<string>()
    selectedCategories.forEach(categoryId => {
      const category = JOB_CATEGORIES.find(c => c.id === categoryId)
      if (category) {
        category.tags.forEach(tag => categoryTags.add(tag))
      }
    })

    // Filter to only show tags that exist in baseTags AND belong to selected categories
    return baseTags.filter(tag => categoryTags.has(tag))
  }, [selectedCategories, allAvailableTags, availableTags])

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
    setSelectedCategories(prev => {
      const isSelected = prev.includes(categoryId)
      const newCategories = isSelected
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]

      // When deselecting a category, clear tags that belong only to that category
      if (isSelected) {
        const deselectedCategory = JOB_CATEGORIES.find(c => c.id === categoryId)
        if (deselectedCategory) {
          // Get tags that belong to other selected categories
          const otherCategoryTags = new Set<string>()
          newCategories.forEach(id => {
            const cat = JOB_CATEGORIES.find(c => c.id === id)
            if (cat) {
              cat.tags.forEach(tag => otherCategoryTags.add(tag))
            }
          })

          // Remove tags that don't belong to any remaining selected category
          // Only remove from manual tags (auto tags are managed by search query)
          setManualSelectedTags(prevTags => 
            prevTags.filter(tag => otherCategoryTags.has(tag))
          )
        }
      }

      return newCategories
    })
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
    // Filter by selected categories (HIGHEST PRIORITY)
    if (selectedCategories.length > 0) {
      // Get all tags from selected categories
      const categoryTags = new Set<string>()
      selectedCategories.forEach(categoryId => {
        const category = JOB_CATEGORIES.find(c => c.id === categoryId)
        if (category) {
          category.tags.forEach(tag => categoryTags.add(tag))
        }
      })

      // Check if freelancer has at least one tag from selected categories
      // IMPORTANT: Only check skills_tags, exclude work_style_tags and provinces
      const relevantTags = f.skills_tags.filter(tag => 
        !WORK_STYLES.includes(tag) && !PROVINCES.includes(tag)
      )
      const hasMatchingCategoryTag = relevantTags.some(tag => categoryTags.has(tag))
      if (!hasMatchingCategoryTag) {
        return false
      }
    }

    // Filter by provinces
    if (selectedProvinces.length > 0) {
      const freelancerProvince = (f as any).province
      if (!freelancerProvince || !selectedProvinces.includes(freelancerProvince)) {
        return false
      }
    }

    // Filter by work styles
    if (selectedWorkStyles.length > 0) {
      const freelancerWorkStyles = (f as any).work_style_tags || []
      const hasMatchingWorkStyle = selectedWorkStyles.some(style => 
        freelancerWorkStyles.includes(style) || f.skills_tags.includes(style)
      )
      if (!hasMatchingWorkStyle) {
        return false
      }
    }

    // Filter by tags (category tags) - only if no category is selected
    // If category is selected, tags are already filtered by category
    if (selectedTags.length > 0 && selectedCategories.length === 0) {
      const hasMatchingTag = selectedTags.some(tag => f.skills_tags.includes(tag))
      if (!hasMatchingTag) {
        return false
      }
    }

    // If both category and tags are selected, freelancer must match both
    if (selectedTags.length > 0 && selectedCategories.length > 0) {
      const hasMatchingTag = selectedTags.some(tag => f.skills_tags.includes(tag))
      if (!hasMatchingTag) {
        return false
      }
    }

    return true
    })
  }, [freelancers, selectedCategories, selectedProvinces, selectedWorkStyles, selectedTags])

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

          {/* Category Buttons */}
          <div className="flex flex-wrap gap-2 mt-2">
            {categories.map(category => {
              const isSelected = selectedCategories.includes(category.id)
              return (
                <Button
                  key={category.id}
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryClick(category.id)}
                  className={isSelected ? 'bg-primary text-primary-foreground' : ''}
                >
                  {category.name}
                </Button>
              )
            })}
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
                selectedCategories={selectedCategories}
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
                      selectedCategories,
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
    </div>
  )
}
