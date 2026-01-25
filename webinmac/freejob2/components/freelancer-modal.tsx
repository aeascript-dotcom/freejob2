'use client'

import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { User } from '@/types/database'
import { MessageSquare } from 'lucide-react'

interface FreelancerModalProps {
  freelancer: User
  isOpen: boolean
  onClose: () => void
}

export function FreelancerModal({ freelancer, isOpen, onClose }: FreelancerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-card-foreground text-thai" style={{ color: 'hsl(var(--accent))' }}>โปรไฟล์ฟรีแลนซ์</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage 
                src={freelancer.avatar_url || `https://pravatar.cc/150?img=${freelancer.id.slice(0, 2)}`} 
                alt={freelancer.full_name}
              />
              <AvatarFallback className="text-2xl">
                {freelancer.full_name?.charAt(0)?.toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2 text-card-foreground text-thai">{freelancer.full_name}</h2>
              <Badge 
                variant={freelancer.availability_status === 'available' ? 'default' : 'secondary'}
                className={`text-thai border-2 ${
                  freelancer.availability_status === 'available' 
                    ? '' 
                    : 'bg-secondary text-secondary-foreground'
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
          </div>

          {/* Bio Section */}
          <div>
            <h3 className="font-semibold mb-2 text-card-foreground text-thai" style={{ color: 'hsl(var(--accent))' }}>เกี่ยวกับฉัน</h3>
            {freelancer.bio_long ? (
              <p className="text-muted-foreground whitespace-pre-wrap text-thai">{freelancer.bio_long}</p>
            ) : (
              <p className="text-muted-foreground text-thai">{freelancer.bio_short || 'ไม่มีคำอธิบาย'}</p>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-card-foreground text-thai" style={{ color: 'hsl(var(--accent))' }}>ทักษะและความเชี่ยวชาญ</h3>
            <div className="flex flex-wrap gap-2">
              {freelancer.skills_tags?.map((tag, idx) => (
                <Badge key={`skill-${tag}-${idx}`} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: 'hsl(var(--accent))' }}>
            <div>
              <p className="text-sm text-muted-foreground text-thai mb-1">งานที่ทำแล้ว</p>
              <p className="text-2xl font-bold text-card-foreground text-thai" style={{ color: 'hsl(var(--accent))' }}>
                {freelancer.stats_completed_jobs}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground text-thai mb-1">อัตราค่าจ้าง</p>
              <p className="text-xl font-bold text-card-foreground text-thai" style={{ color: 'hsl(var(--accent))' }}>
                ฿{('hourly_rate' in freelancer && typeof freelancer.hourly_rate === 'number') ? freelancer.hourly_rate : 'N/A'}/ชม.
              </p>
            </div>
            {'province' in freelancer && freelancer.province && (
              <div>
                <p className="text-sm text-muted-foreground text-thai mb-1">จังหวัด</p>
                <p className="text-sm font-medium text-card-foreground text-thai">
                  {String(freelancer.province)}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground text-thai mb-1">อีเมล</p>
              <p className="text-sm text-card-foreground break-all">{freelancer.email}</p>
            </div>
          </div>

          {/* Work Style Tags */}
          {'work_style_tags' in freelancer && Array.isArray(freelancer.work_style_tags) && freelancer.work_style_tags.length > 0 && (
            <div className="pt-4 border-t" style={{ borderColor: 'hsl(var(--accent))' }}>
              <h3 className="font-semibold mb-3 text-card-foreground text-thai" style={{ color: 'hsl(var(--accent))' }}>สไตล์การทำงาน</h3>
              <div className="flex flex-wrap gap-2">
                {freelancer.work_style_tags.map((style: string, idx: number) => (
                  <Badge 
                    key={`work-style-${style}-${idx}`} 
                    variant="outline"
                    className="text-thai border-accent"
                    style={{ 
                      borderColor: 'hsl(var(--accent))',
                      color: 'hsl(var(--accent))'
                    }}
                  >
                    {style}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-4 border-t" style={{ borderColor: 'hsl(var(--accent))' }}>
            <Link href={`/chat/${freelancer.id}`} onClick={onClose}>
              <Button
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
