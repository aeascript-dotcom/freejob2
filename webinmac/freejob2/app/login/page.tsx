'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { login } from '@/lib/auth-mock'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      const success = login()
      if (success) {
        router.push('/')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image
              src="/logofreejob.png"
              alt="Freejob Logo"
              width={200}
              height={100}
              priority
              className="object-contain"
              style={{ width: 'auto', height: 'auto' }}
            />
          </Link>
        </div>
        
        <Card className="w-full card-black">
          <CardHeader>
            <CardTitle className="text-thai">เข้าสู่ระบบ Freejob</CardTitle>
            <CardDescription className="text-thai">
              เชื่อมต่อกับลูกค้าและฟรีแลนซ์
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full" 
              variant="outline"
            >
              <span className="text-thai">{isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ (Mock)'}</span>
            </Button>
            <div className="text-center text-sm text-muted-foreground text-thai">
              นี่เป็นการยืนยันตัวตนแบบจำลองสำหรับการสาธิต
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
