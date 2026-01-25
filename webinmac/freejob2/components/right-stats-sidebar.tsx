'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Star, Flame } from 'lucide-react'

// Mock data for trending categories
const trendingCategories = [
  { name: 'ซ่อมบ้าน', count: 120, isTop: true },
  { name: 'กราฟิก', count: 95, isTop: false },
  { name: 'การตลาด', count: 80, isTop: false },
  { name: 'เขียนโปรแกรม', count: 75, isTop: false },
  { name: 'แปลภาษา', count: 60, isTop: false },
]

// Mock data for freelancer of the month
const freelancerOfTheMonth = {
  id: 'top-1',
  name: 'สมหญิง เก่งมาก',
  category: 'กราฟิกและดีไซน์',
  rating: 5.0,
  avatar_url: '/character/a1.png', // Use local avatar
  completed_jobs: 45,
  skills: ['Logo Design', 'Banner', 'UX/UI']
}

export function RightStatsSidebar() {
  return (
    <aside className="w-full space-y-6">
      {/* Trending Categories Widget */}
      <Card className="card-black bg-card/30 backdrop-blur-sm border-2 border-accent">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-thai flex items-center gap-2" style={{ color: 'hsl(var(--accent))' }}>
            <TrendingUp className="w-5 h-5" style={{ color: 'hsl(var(--accent))' }} />
            ยอดนิยมตามหมวดหมู่
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingCategories.map((category, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg transition-all hover:bg-secondary/30"
              style={{
                backgroundColor: category.isTop ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                border: category.isTop ? '1px solid hsl(var(--accent))' : '1px solid transparent'
              }}
            >
              <div className="flex items-center gap-2 flex-1">
                {category.isTop && (
                  <Flame className="w-4 h-4" style={{ color: 'hsl(var(--accent))' }} />
                )}
                <span className="text-sm text-thai text-card-foreground">{category.name}</span>
              </div>
              <span 
                className="text-sm font-bold text-thai"
                style={{ color: 'hsl(var(--accent))' }}
              >
                {category.count} งาน
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Freelancer of the Month Widget */}
      <Card 
        className="card-black bg-card/30 backdrop-blur-sm border-2 relative overflow-hidden"
        style={{
          borderColor: 'hsl(var(--accent))',
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), 8px 8px 0px 0px rgba(255, 215, 0, 0.2)'
        }}
      >
        {/* Gold Glow Effect */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, hsl(var(--accent)) 0%, transparent 70%)'
          }}
        />
        
        <CardHeader className="pb-3 relative z-10">
          <CardTitle className="text-lg text-thai flex items-center gap-2" style={{ color: 'hsl(var(--accent))' }}>
            <Star className="w-5 h-5 fill-current" style={{ color: 'hsl(var(--accent))' }} />
            ฟรีแลนซ์ดีเด่นประจำเดือน
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 relative z-10">
          {/* Avatar and Name */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-3">
              <Avatar className="h-20 w-20 border-4" style={{ borderColor: 'hsl(var(--accent))' }}>
                <AvatarImage 
                  src={freelancerOfTheMonth.avatar_url} 
                  alt={freelancerOfTheMonth.name}
                />
                <AvatarFallback className="bg-accent text-accent-foreground text-2xl">
                  {freelancerOfTheMonth.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {/* Crown/Badge Effect */}
              <div 
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'hsl(var(--accent))' }}
              >
                <Star className="w-5 h-5 fill-current text-accent-foreground" />
              </div>
            </div>
            <h3 className="font-bold text-lg text-thai text-card-foreground mb-1">
              {freelancerOfTheMonth.name}
            </h3>
            <p className="text-sm text-muted-foreground text-thai mb-2">
              {freelancerOfTheMonth.category}
            </p>
            
            {/* Rating Badge */}
            <Badge 
              className="mb-3 px-3 py-1 text-thai"
              style={{
                backgroundColor: 'hsl(var(--accent))',
                color: 'hsl(var(--accent-foreground))',
                border: '2px solid hsl(var(--accent))'
              }}
            >
              <Star className="w-4 h-4 fill-current mr-1" />
              {freelancerOfTheMonth.rating.toFixed(1)}
            </Badge>
          </div>

          {/* Stats */}
          <div className="pt-3 border-t" style={{ borderColor: 'hsl(var(--accent))' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground text-thai">งานที่ทำแล้ว</span>
              <span 
                className="text-sm font-bold text-thai"
                style={{ color: 'hsl(var(--accent))' }}
              >
                {freelancerOfTheMonth.completed_jobs} งาน
              </span>
            </div>
            
            {/* Skills */}
            <div className="mt-3">
              <p className="text-xs text-muted-foreground text-thai mb-2">ทักษะหลัก:</p>
              <div className="flex flex-wrap gap-1.5">
                {freelancerOfTheMonth.skills.map((skill, idx) => (
                  <Badge 
                    key={idx}
                    variant="outline"
                    className="text-xs border-accent text-card-foreground"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}
