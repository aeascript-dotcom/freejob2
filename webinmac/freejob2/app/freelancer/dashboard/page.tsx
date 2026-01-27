'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useFreelancer } from '@/context/freelancer-context'
import { useAuth } from '@/context/auth-context'
import { Briefcase, Users, DollarSign, LogOut, Pencil } from 'lucide-react'
import Link from 'next/link'
import { InsightsSidebar } from '@/components/dashboard/insights-sidebar'

export default function FreelancerDashboard() {
  const { user, logout: handleLogout, isAuthenticated } = useAuth()
  const { currentFreelancer, loading } = useFreelancer()

  const handleLogoutClick = async () => {
    await handleLogout()
    window.location.href = '/'
  }

  if (!isAuthenticated || !user || loading || !currentFreelancer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground text-thai">กำลังโหลด...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground text-thai heading-english">แดชบอร์ดฟรีแลนซ์</h1>
          <Button onClick={handleLogoutClick} variant="outline" className="text-thai">
            <LogOut className="w-4 h-4 mr-2" />
            ออกจากระบบ
          </Button>
        </div>

        {/* 2-Column Layout: Main Content (Left) + Insights Sidebar (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Main Content (col-span-8 or 9) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
          <Card className="card-black">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground text-thai">โปรเจกต์ที่กำลังทำ</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">3</div>
              <p className="text-xs text-muted-foreground text-thai">+2 จากเดือนที่แล้ว</p>
            </CardContent>
          </Card>

          <Card className="card-black">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground text-thai">รายได้รวม</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground" style={{ color: 'hsl(var(--accent))' }}>฿15,000</div>
              <p className="text-xs text-muted-foreground text-thai">+20% จากเดือนที่แล้ว</p>
            </CardContent>
          </Card>

          <Card className="card-black">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground text-thai">รีวิวจากลูกค้า</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">4.8</div>
              <p className="text-xs text-muted-foreground text-thai">จาก 12 รีวิว</p>
            </CardContent>
          </Card>
        </div>

        {/* Profile Card */}
        <Card className="mb-8 card-black">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-card-foreground text-thai heading-english">โปรไฟล์ของฉัน</CardTitle>
              <CardDescription className="text-card-foreground text-thai">ข้อมูลฟรีแลนซ์ของคุณ</CardDescription>
            </div>
            <Link href="/freelancer/settings">
              <Button
                variant="outline"
                className="text-thai border-2"
                style={{
                  borderColor: 'hsl(var(--accent))',
                  color: 'hsl(var(--accent))'
                }}
              >
                <Pencil className="w-4 h-4 mr-2" />
                แก้ไขโปรไฟล์
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Image - Large */}
              <div className="flex-shrink-0">
                <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4" style={{ borderColor: 'hsl(var(--accent))' }}>
                  <AvatarImage 
                    src={currentFreelancer.avatar_url || `/character/a1.png`} 
                    alt={currentFreelancer.full_name || 'Profile'}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-accent text-accent-foreground text-4xl">
                    {currentFreelancer.full_name?.charAt(0)?.toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* Profile Information */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="text-sm font-medium text-card-foreground text-thai">ชื่อ</label>
                  <p className="text-lg text-card-foreground text-thai">{currentFreelancer.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-card-foreground text-thai">อีเมล</label>
                  <p className="text-lg text-card-foreground">{currentFreelancer.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-card-foreground text-thai">เกี่ยวกับฉัน</label>
                  <p className="text-lg text-card-foreground text-thai">{currentFreelancer.bio_long || currentFreelancer.bio_short || 'ไม่มีคำอธิบาย'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-card-foreground text-thai">ทักษะ</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentFreelancer.skills_tags?.map((skill: string) => (
                      <span 
                        key={skill} 
                        className="px-3 py-1 rounded-full text-sm text-thai border-2"
                        style={{
                          borderColor: 'hsl(var(--accent))',
                          color: 'hsl(var(--accent))',
                          backgroundColor: 'transparent'
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-card-foreground text-thai">อัตราค่าจ้าง</label>
                  <p className="text-lg text-card-foreground text-thai" style={{ color: 'hsl(var(--accent))' }}>
                    ฿{(currentFreelancer as any).hourly_rate || 0}/ชั่วโมง
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

            {/* Recent Activity */}
            <Card className="card-black">
              <CardHeader>
                <CardTitle className="text-card-foreground text-thai heading-english">กิจกรรมล่าสุด</CardTitle>
                <CardDescription className="text-card-foreground text-thai">อัปเดตโปรเจกต์ล่าสุดของคุณ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: 'hsl(var(--accent))' }}>
                    <div>
                      <h4 className="font-medium text-card-foreground text-thai">โปรเจกต์ออกแบบเว็บไซต์ใหม่</h4>
                      <p className="text-sm text-muted-foreground text-thai">ลูกค้าส่งข้อกำหนดใหม่</p>
                    </div>
                    <span className="text-sm text-muted-foreground text-thai">2 ชั่วโมงที่แล้ว</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: 'hsl(var(--accent))' }}>
                    <div>
                      <h4 className="font-medium text-card-foreground text-thai">พัฒนาแอปมือถือ</h4>
                      <p className="text-sm text-muted-foreground text-thai">เสร็จสิ้น milestone ของโปรเจกต์</p>
                    </div>
                    <span className="text-sm text-muted-foreground text-thai">1 วันที่แล้ว</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: 'hsl(var(--accent))' }}>
                    <div>
                      <h4 className="font-medium text-card-foreground text-thai">แพลตฟอร์ม E-commerce</h4>
                      <p className="text-sm text-muted-foreground text-thai">ได้รับคำขอใบเสนอราคาใหม่</p>
                    </div>
                    <span className="text-sm text-muted-foreground text-thai">3 วันที่แล้ว</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Insights Sidebar (col-span-4 or 3) */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24">
              <InsightsSidebar />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
