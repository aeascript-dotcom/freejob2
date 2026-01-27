'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'
import { getAllGlobalTags } from '@/lib/search-utils'
import { WORK_STYLES, PROVINCES } from '@/lib/mock-data'

interface AdvancedSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyTags: (tags: string[]) => void
  initialSelectedTags?: string[]
}

export function AdvancedSearchModal({
  isOpen,
  onClose,
  onApplyTags,
  initialSelectedTags = []
}: AdvancedSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>(initialSelectedTags)
  const inputRef = useRef<HTMLInputElement>(null)

  // Get all tags excluding work styles and provinces (only job-related tags)
  const allTags = useMemo(() => {
    const globalTags = getAllGlobalTags()
    return globalTags.filter(tag => 
      !WORK_STYLES.includes(tag) && !PROVINCES.includes(tag)
    )
  }, [])

  // Get recommended/popular tags (random 10 when search is empty)
  const recommendedTags = useMemo(() => {
    const shuffled = [...allTags].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 10)
  }, [allTags])

  // Filter tags based on search query
  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) {
      return recommendedTags
    }

    const query = searchQuery.toLowerCase().trim()
    return allTags.filter(tag => 
      tag.toLowerCase().includes(query)
    )
  }, [searchQuery, allTags, recommendedTags])

  // Initialize selected tags when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedTags(initialSelectedTags)
      setSearchQuery('')
      // Auto-focus input when modal opens
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen, initialSelectedTags])

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag)
      } else {
        return [...prev, tag]
      }
    })
  }

  const handleApplyTags = () => {
    onApplyTags(selectedTags)
    onClose()
  }

  const handleClearAll = () => {
    setSelectedTags([])
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-thai" style={{ color: 'hsl(var(--accent))' }}>
            🔍 ค้นหาแบบละเอียด
          </DialogTitle>
          <DialogDescription className="text-thai">
            ค้นหาและเลือกแท็กงานที่ต้องการเพื่อกรองผลลัพธ์
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Search Input */}
          <div className="space-y-2">
            <Input
              ref={inputRef}
              type="text"
              placeholder="พิมพ์คีย์เวิร์ดงานที่ต้องการ (เช่น ช่าง, บ้าน, ออกแบบ)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-lg px-4 py-3 text-thai"
            />
            <p className="text-xs text-muted-foreground text-thai">
              {searchQuery.trim() 
                ? `พบ ${filteredTags.length} แท็กที่ตรงกัน` 
                : 'แสดงแท็กแนะนำ (คลิกเพื่อเลือก)'}
            </p>
          </div>

          {/* Selected Tags Display */}
          {selectedTags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-thai">แท็กที่เลือกแล้ว ({selectedTags.length})</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-xs text-thai h-6 px-2"
                >
                  ล้างทั้งหมด
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                {selectedTags.map(tag => (
                  <Badge
                    key={tag}
                    variant="default"
                    className="text-sm px-3 py-1 bg-yellow-400 text-gray-900 border-2 border-yellow-600 hover:bg-yellow-500 cursor-pointer"
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tag Grid */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-thai">
              {searchQuery.trim() ? 'แท็กที่พบ' : 'แท็กแนะนำ'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[400px] overflow-y-auto p-2">
              {filteredTags.length > 0 ? (
                filteredTags.map(tag => {
                  const isSelected = selectedTags.includes(tag)
                  return (
                    <Badge
                      key={tag}
                      variant={isSelected ? 'default' : 'outline'}
                      onClick={() => handleTagClick(tag)}
                      className={`
                        text-sm px-3 py-2 text-center cursor-pointer transition-all duration-200 text-thai
                        ${isSelected
                          ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-2 border-yellow-600 shadow-md scale-105'
                          : 'bg-white hover:bg-gray-100 text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:shadow-sm'
                        }
                      `}
                    >
                      {tag}
                    </Badge>
                  )
                })
              ) : (
                <div className="col-span-full text-center py-8 text-muted-foreground text-thai">
                  ไม่พบแท็กที่ตรงกับ &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-thai"
          >
            ยกเลิก
          </Button>
          <Button
            onClick={handleApplyTags}
            className="text-thai font-bold"
            style={{
              backgroundColor: 'hsl(var(--accent))',
              color: 'hsl(var(--accent-foreground))',
              boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 0.2)'
            }}
            disabled={selectedTags.length === 0}
          >
            ดูผลลัพธ์ ({selectedTags.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
