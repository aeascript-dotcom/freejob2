'use client'

import { useFontSize } from '@/context/font-size-context'
import { cn } from '@/lib/utils'

export function FontSizeSelector() {
  const { fontSize, setFontSize } = useFontSize()

  const sizes: Array<{ key: 'small' | 'medium' | 'large'; label: string }> = [
    { key: 'small', label: 'ก' },
    { key: 'medium', label: 'ก+' },
    { key: 'large', label: 'ก++' },
  ]

  return (
    <div className="flex items-center gap-1 bg-zinc-900 border border-amber-500/30 rounded-lg p-1">
      {sizes.map((size) => {
        const isActive = fontSize === size.key
        return (
          <button
            key={size.key}
            onClick={() => setFontSize(size.key)}
            className={cn(
              'px-3 py-1.5 rounded-md text-sm font-medium transition-all text-thai',
              isActive
                ? 'bg-amber-500 text-black'
                : 'text-amber-500 hover:text-amber-400 hover:bg-zinc-800/50'
            )}
            aria-label={`เปลี่ยนขนาดตัวอักษรเป็น${size.key === 'small' ? 'เล็ก' : size.key === 'medium' ? 'กลาง' : 'ใหญ่'}`}
            aria-pressed={isActive}
          >
            {size.label}
          </button>
        )
      })}
    </div>
  )
}
