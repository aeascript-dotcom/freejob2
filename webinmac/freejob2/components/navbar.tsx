'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/auth-mock'
import { AuthModal } from '@/components/auth/auth-modal'

export function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')

  useEffect(() => {
    const checkUser = () => {
      setUser(getCurrentUser())
    }
    
    checkUser()
    
    const handleStorageChange = () => {
      checkUser()
    }
    
    window.addEventListener('storage', handleStorageChange)
    // Also listen for custom storage events
    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return (
    <nav className="border-b-2 border-accent bg-background/95 backdrop-blur-sm sticky top-0 z-50" style={{
      borderColor: 'hsl(var(--accent))',
      boxShadow: '0 4px 0px 0px rgba(0, 0, 0, 1)'
    }}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/alokastudio-logo.png"
            alt="Aloka Studio Logo"
            width={120}
            height={60}
            priority
            className="object-contain"
            style={{ width: 'auto', height: 'auto' }}
          />
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/freelancer/dashboard">
              <Button variant="outline" className="text-thai">แดชบอร์ด</Button>
            </Link>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="text-thai"
                onClick={() => {
                  setAuthMode('login')
                  setIsAuthModalOpen(true)
                }}
              >
                เข้าระบบ
              </Button>
              <Button 
                className="text-thai"
                onClick={() => {
                  setAuthMode('signup')
                  setIsAuthModalOpen(true)
                }}
              >
                สมัครใช้งาน
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
      />
    </nav>
  )
}
