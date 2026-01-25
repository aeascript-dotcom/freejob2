import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { DisclaimerBanner } from '@/components/home/disclaimer-banner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Briefcase, Users } from 'lucide-react'
import { GridBackground } from '@/components/graphic-elements'
import { SeparatorBold } from '@/components/graphic-elements'

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
      <GridBackground />
      <Navbar />
      <DisclaimerBanner />
      
      <main className="container mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 relative z-10">
          <div className="flex justify-center mb-6">
            <Image
              src="/freejob2logo.png"
              alt="Freejob Logo"
              width={300}
              height={150}
              priority
              className="object-contain"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
          <h1 className="text-5xl mb-4 heading-english" style={{ color: 'hsl(var(--accent))' }}>
            FREELANCE MARKETPLACE
          </h1>
          <p className="text-xl text-foreground text-thai">
            พื้นที่หาฟรีแลนซ์ทำงาน ผ่านการเสนอราคาที่ดีที่สุด
          </p>
        </div>
        
        <SeparatorBold />

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link href="/search">
            <Card className="h-full transition-all cursor-pointer card-black">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 rounded-full w-20 h-20 flex items-center justify-center" style={{
                  background: 'hsl(var(--background))',
                  color: 'hsl(var(--accent))'
                }}>
                  <Briefcase className="w-10 h-10" style={{ color: 'hsl(var(--accent))' }} />
                </div>
                <CardTitle className="text-3xl mb-2 text-thai text-white">งานหาคน</CardTitle>
                <CardDescription className="text-base text-thai text-white">
                  Client Mode - ค้นหาฟรีแลนซ์ที่เหมาะสมกับงานของคุณ
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button size="lg" className="w-full">
                  <span className="text-thai font-bold">เริ่มค้นหา</span>
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/freelancer/dashboard">
            <Card className="h-full transition-all cursor-pointer card-black">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 rounded-full w-20 h-20 flex items-center justify-center" style={{
                  background: 'hsl(var(--background))',
                  color: 'hsl(var(--accent))'
                }}>
                  <Users className="w-10 h-10" style={{ color: 'hsl(var(--accent))' }} />
                </div>
                <CardTitle className="text-3xl mb-2 text-thai text-white">คนหางาน</CardTitle>
                <CardDescription className="text-base text-thai text-white">
                  Freelancer Mode - จัดการงานและรับข้อเสนอจากลูกค้า
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button size="lg" className="w-full">
                  <span className="text-thai font-bold">เข้าสู่แดชบอร์ด</span>
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}
