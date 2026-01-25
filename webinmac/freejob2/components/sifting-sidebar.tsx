'use client'

import { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { JOB_CATEGORIES } from '@/lib/mock-data'

interface SiftingSidebarProps {
  tags: string[]
  selectedTags: string[]
  onTagClick: (tag: string) => void
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

export function SiftingSidebar({ tags, selectedTags, onTagClick }: SiftingSidebarProps) {
  const [sortMode, setSortMode] = useState<SortMode>('alpha')

  // Process tags based on sort mode
  // Use tags.length as part of dependency to detect changes
  const processedTags = useMemo(() => {
    if (sortMode === 'alpha') {
      return sortAlphabetically(tags)
    } else {
      return groupTagsByCategory(tags)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortMode, tags.length, JSON.stringify(tags)])

  return (
    <Card className="sticky top-20 h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">กรองตามแท็ก</CardTitle>
        </div>
        <div className="mt-3">
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            เรียงตาม
          </label>
          <Select value={sortMode} onValueChange={(value) => setSortMode(value as SortMode)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alpha">เรียงตามตัวอักษร</SelectItem>
              <SelectItem value="group">เรียงตามหมวดหมู่</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {tags.length === 0 ? (
          <p className="text-sm text-muted-foreground">ไม่มีแท็กที่เกี่ยวข้อง</p>
        ) : sortMode === 'alpha' ? (
          // Alphabetical mode - simple list
          <div className="flex flex-wrap gap-2">
            {(processedTags as string[]).map((tag, idx) => (
              <Badge
                key={idx}
                variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/80 transition-colors"
                onClick={() => onTagClick(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        ) : (
          // Group mode - organized by category
          <div className="space-y-4">
            {(processedTags as Array<{ categoryName: string; tags: string[] }>).map((group, groupIdx) => (
              <div key={groupIdx}>
                <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                  {group.categoryName}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {group.tags.map((tag, tagIdx) => (
                    <Badge
                      key={tagIdx}
                      variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                      className="cursor-pointer hover:bg-primary/80 transition-colors"
                      onClick={() => onTagClick(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {selectedTags.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium mb-2">แท็กที่เลือก:</p>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag, idx) => (
                <Badge
                  key={idx}
                  variant="default"
                  className="cursor-pointer"
                  onClick={() => onTagClick(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
