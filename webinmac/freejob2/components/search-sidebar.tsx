'use client'

import { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { JOB_CATEGORIES, PROVINCES, WORK_STYLES } from '@/lib/mock-data'
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SearchSidebarProps {
  tags: string[]
  selectedTags: string[]
  selectedCategories?: string[] // Category IDs
  selectedProvinces: string[]
  selectedWorkStyles: string[]
  autoSelectedTags?: string[]
  onTagClick: (tag: string) => void
  onCategoryClick?: (categoryId: string) => void
  onProvinceClick: (province: string) => void
  onWorkStyleClick: (style: string) => void
}

type SortMode = 'alpha' | 'group'

/**
 * Check if a character is Thai
 */
const isThai = (char: string): boolean => {
  return /[\u0E00-\u0E7F]/.test(char)
}

/**
 * Get first character of a string (handles both Thai and English)
 */
const getFirstChar = (str: string): string => {
  return str.charAt(0)
}

/**
 * Sort tags alphabetically with Thai first
 */
const sortAlphabetically = (tags: string[]): string[] => {
  return [...tags].sort((a, b) => {
    const firstCharA = getFirstChar(a)
    const firstCharB = getFirstChar(b)
    const isThaiA = isThai(firstCharA)
    const isThaiB = isThai(firstCharB)

    // Thai characters come first
    if (isThaiA && !isThaiB) return -1
    if (!isThaiA && isThaiB) return 1

    // Both Thai or both English - sort normally
    return a.localeCompare(b, 'th')
  })
}

/**
 * Group tags by category
 */
const groupTagsByCategory = (tags: string[]): Array<{ categoryName: string; tags: string[] }> => {
  const grouped: Record<string, string[]> = {}
  const uncategorized: string[] = []

  // Initialize groups for each category
  JOB_CATEGORIES.forEach(category => {
    grouped[category.name] = []
  })

  // Group tags
  tags.forEach(tag => {
    let found = false
    for (const category of JOB_CATEGORIES) {
      if (category.tags.includes(tag)) {
        if (!grouped[category.name]) {
          grouped[category.name] = []
        }
        grouped[category.name].push(tag)
        found = true
        break
      }
    }
    if (!found) {
      uncategorized.push(tag)
    }
  })

  // Convert to array format and filter out empty categories
  const result: Array<{ categoryName: string; tags: string[] }> = []
  
  JOB_CATEGORIES.forEach(category => {
    if (grouped[category.name] && grouped[category.name].length > 0) {
      result.push({
        categoryName: category.name,
        tags: sortAlphabetically(grouped[category.name]),
      })
    }
  })

  // Add uncategorized tags if any
  if (uncategorized.length > 0) {
    result.push({
      categoryName: 'อื่นๆ',
      tags: sortAlphabetically(uncategorized),
    })
  }

  return result
}

export function SearchSidebar({
  tags,
  selectedTags,
  selectedCategories = [],
  selectedProvinces,
  selectedWorkStyles,
  autoSelectedTags = [],
  onTagClick,
  onCategoryClick,
  onProvinceClick,
  onWorkStyleClick,
}: SearchSidebarProps) {
  const [sortMode, setSortMode] = useState<SortMode>('alpha')
  const [isProvinceOpen, setIsProvinceOpen] = useState(true)
  const [isWorkStyleOpen, setIsWorkStyleOpen] = useState(true)
  const [isCategoryOpen, setIsCategoryOpen] = useState(true)
  const [provinceSearchQuery, setProvinceSearchQuery] = useState('')
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false)

  // Filter out work style tags and province from category tags
  // Tags are already filtered by selectedCategories in the parent component
  const categoryTags = useMemo(() => {
    return tags.filter(tag => 
      !WORK_STYLES.includes(tag) && 
      !PROVINCES.includes(tag)
    )
  }, [tags])

  // Show indicator when categories are filtering tags
  const hasCategoryFilter = selectedCategories.length > 0

  // Process tags based on sort mode
  const processedTags = useMemo(() => {
    if (sortMode === 'alpha') {
      return sortAlphabetically(categoryTags)
    } else {
      return groupTagsByCategory(categoryTags)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortMode, categoryTags.length, JSON.stringify(categoryTags)])

  return (
    <Card className="sticky top-20 h-fit bg-card text-card-foreground card-black">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-thai heading-english">กรองผลการค้นหา</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Section A: Province Selection */}
        <div>
          <button
            onClick={() => setIsProvinceOpen(!isProvinceOpen)}
            className="flex items-center justify-between w-full mb-3 text-base font-semibold text-thai transition-colors"
            style={{ color: 'hsl(var(--accent))' }}
          >
            <span>📍 เลือกจังหวัด</span>
            {isProvinceOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          {isProvinceOpen && (
            <div className="space-y-3">
              {/* Search Input and Dropdown Container */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="ค้นหาจังหวัด..."
                  value={provinceSearchQuery}
                  onChange={(e) => {
                    setProvinceSearchQuery(e.target.value)
                    setShowProvinceDropdown(true)
                  }}
                  onFocus={() => setShowProvinceDropdown(true)}
                  className="pl-9 pr-9 text-sm text-thai bg-card text-card-foreground border-2"
                  style={{ borderColor: 'hsl(var(--accent))' }}
                />
                {provinceSearchQuery && (
                  <button
                    onClick={() => {
                      setProvinceSearchQuery('')
                      setShowProvinceDropdown(false)
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Filtered Province Dropdown */}
                {showProvinceDropdown && provinceSearchQuery && (
                <div className="max-h-60 overflow-y-auto border-2 rounded-lg bg-card" style={{ borderColor: 'hsl(var(--accent))' }}>
                  {PROVINCES.filter(province => 
                    province.toLowerCase().includes(provinceSearchQuery.toLowerCase())
                  ).map((province) => (
                    <div
                      key={province}
                      className="px-3 py-2 cursor-pointer hover:bg-accent/20 text-sm text-card-foreground text-thai transition-colors"
                      onClick={() => {
                        onProvinceClick(province)
                        setProvinceSearchQuery('')
                        setShowProvinceDropdown(false)
                      }}
                    >
                      {province}
                    </div>
                  ))}
                  {PROVINCES.filter(province => 
                    province.toLowerCase().includes(provinceSearchQuery.toLowerCase())
                  ).length === 0 && (
                    <div className="px-3 py-2 text-sm text-muted-foreground text-thai text-center">
                      ไม่พบจังหวัดที่ค้นหา
                    </div>
                  )}
                </div>
                )}
              </div>

              {/* Selected Provinces as Small Badges */}
              {selectedProvinces.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedProvinces.map((province) => (
                    <Badge
                      key={province}
                      variant="default"
                      className="cursor-pointer hover:bg-accent/80 transition-colors text-xs px-2 py-0.5 text-thai border border-accent"
                      style={{
                        backgroundColor: 'hsl(var(--accent))',
                        color: 'hsl(var(--accent-foreground))',
                        borderColor: 'hsl(var(--accent))'
                      }}
                      onClick={() => onProvinceClick(province)}
                    >
                      {province} ×
                    </Badge>
                  ))}
                </div>
              )}

              {/* Show All Provinces Button */}
              {!showProvinceDropdown && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs text-thai border-accent"
                  onClick={() => setShowProvinceDropdown(true)}
                >
                  ดูรายชื่อจังหวัดทั้งหมด ({PROVINCES.length} จังหวัด)
                </Button>
              )}

              {/* Full Province List (when button clicked) */}
              {showProvinceDropdown && !provinceSearchQuery && (
                <div className="max-h-60 overflow-y-auto border-2 rounded-lg bg-card p-2" style={{ borderColor: 'hsl(var(--accent))' }}>
                  <div className="grid grid-cols-2 gap-1">
                    {PROVINCES.map((province) => (
                      <div
                        key={province}
                        className={`px-2 py-1 cursor-pointer rounded text-xs text-thai transition-colors ${
                          selectedProvinces.includes(province)
                            ? 'bg-accent text-accent-foreground'
                            : 'hover:bg-accent/20 text-card-foreground'
                        }`}
                        onClick={() => onProvinceClick(province)}
                      >
                        {province}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 text-xs text-thai border-accent"
                    onClick={() => setShowProvinceDropdown(false)}
                  >
                    ปิดรายการ
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section B: Work Style */}
        <div className="border-t border-border pt-4">
          <button
            onClick={() => setIsWorkStyleOpen(!isWorkStyleOpen)}
            className="flex items-center justify-between w-full mb-3 text-base font-semibold text-thai transition-colors"
            style={{ color: 'hsl(var(--accent))' }}
          >
            <span>⚡ สไตล์การทำงาน</span>
            {isWorkStyleOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          {isWorkStyleOpen && (
            <div className="flex flex-wrap gap-2.5">
              {WORK_STYLES.map((style) => (
                <Badge
                  key={style}
                  variant={selectedWorkStyles.includes(style) ? 'default' : 'secondary'}
                  className={`cursor-pointer transition-colors text-sm px-3 py-1.5 text-thai border-2 ${
                    selectedWorkStyles.includes(style)
                      ? 'bg-accent hover:bg-accent/80 text-accent-foreground'
                      : 'bg-secondary/50 hover:bg-secondary text-secondary-foreground'
                  }`}
                  style={{
                    borderColor: selectedWorkStyles.includes(style) ? 'hsl(var(--accent))' : 'hsl(var(--border))',
                    color: selectedWorkStyles.includes(style) ? 'hsl(var(--accent-foreground))' : 'hsl(var(--foreground))'
                  }}
                  onClick={() => onWorkStyleClick(style)}
                >
                  {style}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Section C: Job Categories */}
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center justify-between flex-1 text-base font-semibold text-card-foreground hover:text-accent-foreground transition-colors"
            >
              <span>📁 หมวดหมู่งาน</span>
              {isCategoryOpen ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
          
          {isCategoryOpen && (
            <>
              {hasCategoryFilter && (
                <div className="mb-3 p-2 bg-accent/30 border border-accent rounded text-xs text-accent-foreground text-thai">
                  กำลังแสดงแท็กจาก {selectedCategories.length} หมวดหมู่ที่เลือก
                </div>
              )}
              <div className="mb-4">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  เรียงตาม
                </label>
                <Select value={sortMode} onValueChange={(value) => setSortMode(value as SortMode)}>
                  <SelectTrigger className="w-full h-10 text-sm text-thai" style={{ borderColor: 'hsl(var(--accent))' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alpha" className="text-thai">เรียงตามตัวอักษร</SelectItem>
                    <SelectItem value="group" className="text-thai">เรียงตามหมวดหมู่</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {categoryTags.length === 0 ? (
                <p className="text-sm text-card-foreground">ไม่มีแท็กที่เกี่ยวข้อง</p>
              ) : sortMode === 'alpha' ? (
                // Alphabetical mode - simple list
                <div className="flex flex-wrap gap-2.5">
                  {(processedTags as string[]).map((tag, idx) => {
                    const isSelected = selectedTags.includes(tag)
                    const isAutoSelected = autoSelectedTags.includes(tag)
                    return (
                      <Badge
                        key={idx}
                        variant={isSelected ? 'default' : 'outline'}
                        className={`cursor-pointer hover:bg-primary/80 transition-all text-sm px-3 py-1.5 border-2 text-thai break-words max-w-full ${
                          isAutoSelected ? 'ring-2 ring-yellow-400 ring-offset-2 animate-pulse' : ''
                        }`}
                        style={{
                          borderColor: isSelected 
                            ? 'hsl(var(--accent))' 
                            : isAutoSelected 
                              ? 'rgba(255, 215, 0, 0.6)' 
                              : 'transparent',
                          color: isSelected 
                            ? 'hsl(var(--accent))' 
                            : isAutoSelected 
                              ? 'hsl(var(--accent))' 
                              : 'hsl(var(--foreground))',
                          backgroundColor: isAutoSelected && !isSelected 
                            ? 'rgba(255, 215, 0, 0.15)' 
                            : undefined,
                          fontWeight: isAutoSelected ? 'bold' : 'normal',
                          wordBreak: 'break-word',
                          whiteSpace: 'normal'
                        }}
                        onClick={() => onTagClick(tag)}
                        title={isAutoSelected ? 'ถูกเลือกอัตโนมัติจากการค้นหา' : tag}
                      >
                        {tag} {isAutoSelected && '✨'}
                      </Badge>
                    )
                  })}
                </div>
              ) : (
                // Group mode - organized by category
                <div className="space-y-4">
                  {(processedTags as Array<{ categoryName: string; tags: string[] }>).map((group, groupIdx) => (
                    <div key={groupIdx}>
                      <h4 className="text-sm font-semibold text-card-foreground mb-3 uppercase tracking-wide">
                        {group.categoryName}
                      </h4>
                      <div className="flex flex-wrap gap-2.5">
                        {group.tags.map((tag, tagIdx) => {
                          const isSelected = selectedTags.includes(tag)
                          const isAutoSelected = autoSelectedTags.includes(tag)
                          return (
                            <Badge
                              key={tagIdx}
                              variant={isSelected ? 'default' : 'outline'}
                              className={`cursor-pointer hover:bg-primary/80 transition-all text-sm px-3 py-1.5 text-card-foreground text-thai break-words max-w-full ${
                                isAutoSelected ? 'ring-2 ring-yellow-400 ring-offset-2 animate-pulse' : ''
                              }`}
                              style={{
                                borderColor: isSelected 
                                  ? 'hsl(var(--accent))' 
                                  : isAutoSelected 
                                    ? 'rgba(255, 215, 0, 0.6)' 
                                    : 'transparent',
                                color: isSelected 
                                  ? 'hsl(var(--accent))' 
                                  : isAutoSelected 
                                    ? 'hsl(var(--accent))' 
                                    : 'hsl(var(--foreground))',
                                backgroundColor: isAutoSelected && !isSelected 
                                  ? 'rgba(255, 215, 0, 0.15)' 
                                  : undefined,
                                fontWeight: isAutoSelected ? 'bold' : 'normal',
                                wordBreak: 'break-word',
                                whiteSpace: 'normal'
                              }}
                              onClick={() => onTagClick(tag)}
                              title={isAutoSelected ? 'ถูกเลือกอัตโนมัติจากการค้นหา' : tag}
                            >
                              {tag} {isAutoSelected && '✨'}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Selected Filters Summary */}
        {(selectedTags.length > 0 || selectedProvinces.length > 0 || selectedWorkStyles.length > 0 || selectedCategories.length > 0) && (
          <div className="border-t border-border pt-4">
            <p className="text-base font-semibold mb-3 text-card-foreground">ตัวกรองที่เลือก:</p>
            <div className="flex flex-wrap gap-2.5 mb-4">
              {selectedCategories.map((categoryId) => {
                const category = JOB_CATEGORIES.find(c => c.id === categoryId)
                return category ? (
                  <Badge
                    key={categoryId}
                    variant="default"
                    className="cursor-pointer bg-accent text-accent-foreground text-sm px-3 py-1.5 border-2 border-accent text-thai"
                    onClick={() => onCategoryClick?.(categoryId)}
                  >
                    📁 {category.name} ×
                  </Badge>
                ) : null
              })}
              {selectedProvinces.map((province) => (
                <Badge
                  key={province}
                  variant="default"
                  className="cursor-pointer bg-accent text-accent-foreground text-sm px-3 py-1.5 border-2 border-accent text-thai"
                  onClick={() => onProvinceClick(province)}
                >
                  📍 {province} ×
                </Badge>
              ))}
              {selectedWorkStyles.map((style) => (
                <Badge
                  key={style}
                  variant="default"
                  className="cursor-pointer bg-accent text-accent-foreground text-sm px-3 py-1.5 border-2 border-accent text-thai"
                  onClick={() => onWorkStyleClick(style)}
                >
                  ⚡ {style} ×
                </Badge>
              ))}
              {selectedTags.map((tag, idx) => (
                <Badge
                  key={idx}
                  variant="default"
                  className="cursor-pointer bg-accent text-accent-foreground text-sm px-3 py-1.5 border-2 border-accent"
                  onClick={() => onTagClick(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
            <Button
              variant="outline"
              size="default"
              className="w-full text-sm py-2.5"
              onClick={() => {
                selectedCategories.forEach(catId => onCategoryClick?.(catId))
                selectedProvinces.forEach(p => onProvinceClick(p))
                selectedWorkStyles.forEach(s => onWorkStyleClick(s))
                selectedTags.forEach(t => onTagClick(t))
              }}
            >
              ล้างตัวกรองทั้งหมด
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
