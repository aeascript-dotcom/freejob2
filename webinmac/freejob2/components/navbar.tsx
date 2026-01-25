'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FontSizeSelector } from '@/components/ui/font-size-selector'
import { useEffect, useState } from 'react'
import { getCurrentUser, logout } from '@/lib/auth-mock'
import { AuthModal } from '@/components/auth/auth-modal'
import { ChevronDown, LogOut } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
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

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  return (
    <>
      {/* Top Message Bar */}
      <div className="h-8 bg-zinc-900 text-xs text-zinc-400 flex items-center justify-center sticky top-0 z-50 border-b border-white/5">
        <p className="text-thai text-center">
          ทุกคนสามารถเป็นฟรีแลนด์ได้ และเป็นลูกค้าได้พร้อมกัน... ยัดความสามารถของคุณใส่ลงมา แล้วงานจะมาหาเอง
        </p>
      </div>

      {/* Main Navbar */}
      <nav className="h-20 bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-8 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Left: Brand */}
            <div className="flex items-center">
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
            </div>

            {/* Center: Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/">
                <button
                  className={`text-thai text-sm font-medium transition-colors relative ${
                    pathname === '/'
                      ? 'text-amber-500'
                      : 'text-zinc-400 hover:text-amber-500'
                  }`}
                >
                  หน้าแรก
                  {pathname === '/' && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-500" />
                  )}
                </button>
              </Link>
              <Link href="/search">
                <button
                  className={`text-thai text-sm font-medium transition-colors relative ${
                    pathname?.startsWith('/search')
                      ? 'text-amber-500'
                      : 'text-zinc-400 hover:text-amber-500'
                  }`}
                >
                  ค้นหาฟรีแลนซ์
                  {pathname?.startsWith('/search') && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-500" />
                  )}
                </button>
              </Link>
              <Link href="/insights">
                <button
                  className={`text-thai text-sm font-medium transition-colors relative ${
                    pathname === '/insights'
                      ? 'text-amber-500'
                      : 'text-zinc-400 hover:text-amber-500'
                  }`}
                >
                  บทความ/ข่าวสาร
                  {pathname === '/insights' && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-500" />
                  )}
                </button>
              </Link>
            </nav>

            {/* Right: User Actions */}
            <div className="flex items-center gap-4">
              {/* Font Size Selector - Desktop only */}
              <div className="hidden md:block">
                <FontSizeSelector />
              </div>
              
              {user ? (
                <>
                  <Link href="/freelancer/dashboard">
                    <Button
                      className="text-thai font-semibold bg-amber-500 hover:bg-amber-600 text-black"
                    >
                      แดชบอร์ด
                    </Button>
                  </Link>
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-800/50 transition-colors">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback className="bg-amber-500 text-black text-xs">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-white text-thai hidden sm:block">
                        {user.name || user.email}
                      </span>
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors text-thai"
                      >
                        <LogOut className="w-4 h-4" />
                        ออกจากระบบ
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="text-thai text-zinc-400 hover:text-amber-500"
                    onClick={() => {
                      setAuthMode('login')
                      setIsAuthModalOpen(true)
                    }}
                  >
                    เข้าระบบ
                  </Button>
                  <Button
                    className="text-thai font-semibold border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black"
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
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
      />
    </>
  )
}
