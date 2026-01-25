'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { User } from '@/types/database'
import { useState } from 'react'
import { FreelancerModal } from './freelancer-modal'
import { Eye, MessageSquare, MapPin, ShieldAlert } from 'lucide-react'
import { isRegulatedProfession } from '@/lib/utils'

interface FreelancerCardProps {
  freelancer: User
  isSelected?: boolean
  onSelect?: (id: string) => void
  showCheckbox?: boolean
}

export function FreelancerCard({ 
  freelancer, 
  isSelected = false, 
  onSelect,
  showCheckbox = false 
}: FreelancerCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isRegulated = isRegulatedProfession(freelancer.skills_tags || [])

  const handleCardClick = (e: React.MouseEvent) => {
    // ถ้ามี checkbox และคลิกที่ checkbox ให้เลือก/ยกเลิกการเลือก
    // แต่ถ้าคลิกที่ส่วนอื่นของ card ให้เปิด modal
    const target = e.target as HTMLElement
    if (showCheckbox && (target.closest('input[type="checkbox"]') || target.closest('label'))) {
      return // ไม่ทำอะไร ให้ checkbox จัดการเอง
    }
    setIsModalOpen(true)
  }

  return (
    <>
      <Card 
        className={`cursor-pointer transition-all bg-stone-50 text-gray-700 border-2 border-gray-200 hover:scale-[1.02] hover:shadow-lg ${
          isSelected ? 'ring-4 ring-accent' : ''
        }`}
        onClick={handleCardClick}
      >
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar className="h-16 w-16">
            <AvatarImage 
              src={freelancer.avatar_url || `https://pravatar.cc/150?img=${freelancer.id.slice(0, 2)}`} 
              alt={freelancer.full_name || 'Unknown freelancer'}
            />
            <AvatarFallback className="bg-gray-300 text-gray-700">
              {freelancer.full_name?.charAt(0)?.toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg text-gray-800 text-thai">{freelancer.full_name || 'Unknown'}</h3>
              {freelancer.province && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  <span className="text-thai">{freelancer.province}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 text-thai">
              {freelancer.bio_short || 'ไม่มีคำอธิบาย'}
            </p>
          </div>
          {showCheckbox && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation()
                onSelect?.(freelancer.id)
              }}
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
          )}
        </CardHeader>
        <CardContent>
          {/* Regulated Profession Warning - in profile details section */}
          {isRegulated && (
            <div className="mb-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-orange-700 text-thai font-medium leading-relaxed">
                  อาชีพควบคุม: โปรดขอดูใบอนุญาตก่อนเริ่มงาน
                </p>
              </div>
            </div>
          )}
          {/* Work Styles Badges */}
          {freelancer.workStyles && freelancer.workStyles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {freelancer.workStyles.map((style, idx) => (
                <Badge 
                  key={`work-style-${style}-${idx}`} 
                  variant="outline" 
                  className="text-xs border-amber-400 text-amber-700 bg-amber-50 hover:bg-amber-100"
                >
                  {style}
                </Badge>
              ))}
            </div>
          )}
          {/* Skills Tags */}
          <div className="flex flex-wrap gap-2">
            {freelancer.skills_tags?.slice(0, 4).map((tag, idx) => (
              <Badge key={`${tag}-${idx}`} variant="secondary" className="text-xs bg-gray-200 text-gray-700 border border-gray-300">
                {tag}
              </Badge>
            ))}
            {freelancer.skills_tags.length > 4 && (
              <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                +{freelancer.skills_tags.length - 4}
              </Badge>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-gray-600 text-thai">
              งานที่ทำแล้ว: {freelancer.stats_completed_jobs}
            </span>
            <Badge 
              variant={freelancer.availability_status === 'available' ? 'default' : 'secondary'}
              className={`text-thai ${
                freelancer.availability_status === 'available' 
                  ? 'border-2' 
                  : 'bg-gray-300 text-gray-700'
              }`}
              style={freelancer.availability_status === 'available' ? {
                backgroundColor: '#86efac', // Light green (green-300)
                color: '#000000', // Black text
                borderColor: '#4ade80' // Slightly darker green border (green-400)
              } : {}}
            >
              {freelancer.availability_status === 'available' ? 'ว่าง' : 'คิวเต็ม'}
            </Badge>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-4 pt-3 border-t space-y-2 border-gray-300">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-thai border-gray-400 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              onClick={(e) => {
                e.stopPropagation()
                setIsModalOpen(true)
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              ดูโปรไฟล์เต็ม
            </Button>
            <Link href={`/chat/${freelancer.id}`} onClick={(e) => e.stopPropagation()}>
              <Button
                size="sm"
                className="w-full text-thai font-bold"
                style={{
                  backgroundColor: 'hsl(var(--accent))',
                  color: 'hsl(var(--accent-foreground))',
                  boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 0.2)'
                }}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                เสนอราคา
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      <FreelancerModal
        freelancer={freelancer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
