'use client'

import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, AlertCircle, Info, Bell, ExternalLink } from 'lucide-react'

// Mock data for Top Demanded Jobs (reused from insights-sidebar)
const topDemandedJobs = [
  { name: 'กราฟิกและดีไซน์', requests: 150, trend: 'up' },
  { name: 'การตลาดออนไลน์', requests: 120, trend: 'up' },
  { name: 'เขียนโปรแกรม', requests: 90, trend: 'stable' },
  { name: 'ตัดต่อวิดีโอ', requests: 85, trend: 'stable' },
  { name: 'แปลภาษา', requests: 60, trend: 'down' },
]

// Mock data for Platform Statistics
const platformStats = {
  totalJobsThisMonth: 1240,
  totalValueTraded: 4500000, // 4.5M THB
  activeFreelancers: 580,
}

// Mock data for Thai Business News
const businessNews = [
  {
    id: 1,
    headline: 'เทรนด์ E-commerce ไทยปี 2026: วิดีโอสั้นมาแรง',
    date: '2024-12-15',
    excerpt: 'ตลาดอีคอมเมิร์ซไทยเติบโตต่อเนื่อง โดยเฉพาะการขายผ่านวิดีโอสั้นบน TikTok Shop และ Facebook Live ที่มีอัตราการขายเพิ่มขึ้น 40% จากปีที่แล้ว...',
    image: '/character/a1.png',
  },
  {
    id: 2,
    headline: 'รัฐบาลหนุน SME ใช้ฟรีแลนซ์ ลดหย่อนภาษีได้ 2 เท่า',
    date: '2024-12-10',
    excerpt: 'นโยบายใหม่ของรัฐบาลสนับสนุนให้ SME จ้างฟรีแลนซ์ โดยสามารถหักภาษีได้ 2 เท่าของค่าใช้จ่ายปกติ เพื่อกระตุ้นเศรษฐกิจดิจิทัล...',
    image: '/character/a2.png',
  },
  {
    id: 3,
    headline: 'TikTok Shop เปิดฟีเจอร์ใหม่ พ่อค้าแม่ค้าต้องรู้',
    date: '2024-12-05',
    excerpt: 'TikTok Shop เปิดตัวฟีเจอร์ Live Shopping ใหม่ พร้อมระบบ AI ที่ช่วยแนะนำสินค้าให้ลูกค้าอัตโนมัติ ทำให้ยอดขายเพิ่มขึ้นเฉลี่ย 25%...',
    image: '/character/a3.png',
  },
  {
    id: 4,
    headline: 'แพลตฟอร์มฟรีแลนซ์ไทยเติบโต 300% ใน 2 ปี',
    date: '2024-12-01',
    excerpt: 'ตลาดฟรีแลนซ์ในไทยเติบโตอย่างรวดเร็ว โดยมีจำนวนฟรีแลนซ์เพิ่มขึ้น 300% ใน 2 ปีที่ผ่านมา โดยเฉพาะในสาขา AI และ Digital Marketing...',
    image: '/character/a4.png',
  },
]

// Mock data for Platform Announcements
const platformAnnouncements = [
  {
    id: 1,
    type: 'urgent' as const,
    title: 'ประกาศด่วน: หาช่างซ่อมท่อประปา จำนวนมาก!',
    message: 'ในเขตจตุจักร มีงานซ่อมท่อประปาเร่งด่วนจำนวนมาก ฟรีแลนซ์ที่เชี่ยวชาญด้านนี้สามารถรับงานได้ทันที',
    date: '2024-12-20',
  },
  {
    id: 2,
    type: 'tip' as const,
    title: 'อย่าลืมอัปเดตสกิล!',
    message: 'ฟรีแลนซ์ที่มีสกิล "AI Tools" ได้งานมากกว่าปกติ 30% อัปเดตโปรไฟล์ของคุณเพื่อเพิ่มโอกาสรับงาน',
    date: '2024-12-19',
  },
  {
    id: 3,
    type: 'system' as const,
    title: 'ระบบจะปิดปรับปรุงคืนนี้',
    message: 'ระบบจะปิดปรับปรุงคืนนี้ เวลา 02.00 - 04.00 น. เพื่อเพิ่มประสิทธิภาพและความเร็ว',
    date: '2024-12-18',
  },
  {
    id: 4,
    type: 'tip' as const,
    title: 'เทคนิคเพิ่มอัตราการรับงาน',
    message: 'ฟรีแลนซ์ที่มีรูปโปรไฟล์ชัดเจนและรีวิวจากลูกค้า ได้งานมากกว่า 50% เมื่อเทียบกับผู้ที่ไม่มี',
    date: '2024-12-17',
  },
]

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground text-thai heading-english mb-2" style={{ color: 'hsl(var(--accent))' }}>
            หน้าข้อมูลและข่าวสาร
          </h1>
          <p className="text-muted-foreground text-thai">
            ติดตามข้อมูลตลาดงาน ข่าวสารธุรกิจ และประกาศจากแพลตฟอร์ม
          </p>
        </div>

        {/* 3-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Platform Statistics */}
          <div className="lg:col-span-4 space-y-6">
            {/* Top Demanded Jobs */}
            <Card className="card-black border-2" style={{ borderColor: 'hsl(var(--accent))' }}>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-thai" style={{ color: 'hsl(var(--accent))' }}>
                  🔥 5 อันดับงานมาแรง
                </CardTitle>
                <CardDescription className="text-thai">งานที่ถูกค้นหามากที่สุดในเดือนนี้</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topDemandedJobs.map((job, index) => (
                    <div
                      key={job.name}
                      className="flex items-center justify-between p-3 rounded-lg border"
                      style={{ 
                        borderColor: 'hsl(var(--accent))',
                        backgroundColor: index === 0 ? 'rgba(255, 215, 0, 0.1)' : 'transparent'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm"
                          style={{
                            backgroundColor: index === 0 ? 'hsl(var(--accent))' : 'transparent',
                            color: index === 0 ? '#000000' : 'hsl(var(--accent))',
                            border: index === 0 ? 'none' : '2px solid hsl(var(--accent))',
                          }}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-card-foreground text-thai">
                            {job.name}
                          </p>
                          <p className="text-xs text-muted-foreground text-thai">
                            {job.requests} requests
                          </p>
                        </div>
                      </div>
                      {job.trend === 'up' && (
                        <TrendingUp className="w-5 h-5" style={{ color: 'hsl(var(--accent))' }} />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Platform Statistics */}
            <Card className="card-black border-2" style={{ borderColor: 'hsl(var(--accent))' }}>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-thai" style={{ color: 'hsl(var(--accent))' }}>
                  📊 สถิติแพลตฟอร์ม
                </CardTitle>
                <CardDescription className="text-thai">ภาพรวมของแพลตฟอร์ม</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-4 border rounded-lg" style={{ borderColor: 'hsl(var(--accent))' }}>
                    <p className="text-sm text-muted-foreground text-thai mb-2">งานทั้งหมดเดือนนี้</p>
                    <p className="text-4xl font-bold" style={{ color: 'hsl(var(--accent))' }}>
                      {platformStats.totalJobsThisMonth.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg" style={{ borderColor: 'hsl(var(--accent))' }}>
                    <p className="text-sm text-muted-foreground text-thai mb-2">มูลค่ารวมที่ซื้อขาย</p>
                    <p className="text-4xl font-bold" style={{ color: 'hsl(var(--accent))' }}>
                      ฿{(platformStats.totalValueTraded / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg" style={{ borderColor: 'hsl(var(--accent))' }}>
                    <p className="text-sm text-muted-foreground text-thai mb-2">ฟรีแลนซ์ที่ใช้งาน</p>
                    <p className="text-4xl font-bold" style={{ color: 'hsl(var(--accent))' }}>
                      {platformStats.activeFreelancers.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column: Thai Business News */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="card-black border-2" style={{ borderColor: 'hsl(var(--accent))' }}>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-thai" style={{ color: 'hsl(var(--accent))' }}>
                  📰 ข่าวสารธุรกิจไทย
                </CardTitle>
                <CardDescription className="text-thai">อัปเดตเทรนด์และข่าวสารธุรกิจออนไลน์</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {businessNews.map((news) => (
                    <div
                      key={news.id}
                      className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                      style={{ borderColor: 'hsl(var(--accent))' }}
                    >
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted relative">
                            <Image
                              src={news.image}
                              alt={news.headline}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground text-thai mb-1">
                            {new Date(news.date).toLocaleDateString('th-TH', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <h3 className="text-lg font-semibold text-card-foreground text-thai mb-2 line-clamp-2">
                            {news.headline}
                          </h3>
                          <p className="text-sm text-muted-foreground text-thai mb-3 line-clamp-2">
                            {news.excerpt}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-thai"
                            style={{ borderColor: 'hsl(var(--accent))', color: 'hsl(var(--accent))' }}
                          >
                            อ่านเพิ่มเติม
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Platform Announcements */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="card-black border-2" style={{ borderColor: 'hsl(var(--accent))' }}>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-thai" style={{ color: 'hsl(var(--accent))' }}>
                  🔔 ประกาศและแจ้งเตือน
                </CardTitle>
                <CardDescription className="text-thai">ข้อมูลสำคัญสำหรับฟรีแลนซ์</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platformAnnouncements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className={`p-4 rounded-lg border-2 ${
                        announcement.type === 'urgent'
                          ? 'bg-red-500/10 border-red-500'
                          : announcement.type === 'tip'
                          ? 'bg-yellow-500/10 border-yellow-500'
                          : 'bg-blue-500/10 border-blue-500'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {announcement.type === 'urgent' && (
                          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        )}
                        {announcement.type === 'tip' && (
                          <Info className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        )}
                        {announcement.type === 'system' && (
                          <Bell className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-card-foreground text-thai mb-1">
                            {announcement.title}
                          </h4>
                          <p className="text-sm text-muted-foreground text-thai mb-2">
                            {announcement.message}
                          </p>
                          <p className="text-xs text-muted-foreground text-thai">
                            {new Date(announcement.date).toLocaleDateString('th-TH', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
