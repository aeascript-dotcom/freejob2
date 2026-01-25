'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { login } from '@/lib/auth-mock'

// Helper function to get local avatar path (same as in mock-data.ts)
const getLocalAvatar = (index: number): string => {
  const avatarNumber = (index % 20) + 1 // Cycle through 1-20
  return `/character/a${avatarNumber}.png`
}

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode?: 'login' | 'signup'
}

export function AuthModal({ isOpen, onClose, mode = 'login' }: AuthModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [phoneStep, setPhoneStep] = useState<'phone' | 'otp'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [isSendingOTP, setIsSendingOTP] = useState(false)

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setIsLoading(true)
    
    // Simulate loading for 1.5 seconds
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock user data
    const mockUser = {
      id: `mock-${provider}-${Date.now()}`,
      email: provider === 'google' ? 'user@gmail.com' : 'user@facebook.com',
      name: provider === 'google' ? 'ผู้ใช้ Google' : 'ผู้ใช้ Facebook',
      avatar: getLocalAvatar(Math.floor(Math.random() * 20)),
      provider,
      role: 'freelancer'
    }
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(mockUser))
    
    // Trigger storage event for navbar update
    window.dispatchEvent(new Event('storage'))
    
    setIsLoading(false)
    onClose()
    
    // Show success toast (you can integrate with your toast system)
    alert('เข้าสู่ระบบสำเร็จ!')
    
    // Redirect to search
    router.push('/search')
  }

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      alert('กรุณากรอกหมายเลขโทรศัพท์ให้ถูกต้อง')
      return
    }
    
    setIsSendingOTP(true)
    
    // Simulate sending OTP
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSendingOTP(false)
    setPhoneStep('otp')
  }

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      alert('กรุณากรอกรหัส OTP 6 หลัก')
      return
    }
    
    setIsLoading(true)
    
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock user data
    const mockUser = {
      id: `mock-phone-${Date.now()}`,
      email: `user${phoneNumber}@phone.com`,
      name: `ผู้ใช้ ${phoneNumber}`,
      phone: `+66${phoneNumber}`,
      avatar: getLocalAvatar(Math.floor(Math.random() * 20)),
      provider: 'phone',
      role: 'freelancer'
    }
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(mockUser))
    
    // Trigger storage event
    window.dispatchEvent(new Event('storage'))
    
    setIsLoading(false)
    onClose()
    
    // Reset form
    setPhoneStep('phone')
    setPhoneNumber('')
    setOtp('')
    
    // Show success toast
    alert('เข้าสู่ระบบสำเร็จ!')
    
    // Redirect to search
    router.push('/search')
  }

  const handleClose = () => {
    if (!isLoading && !isSendingOTP) {
      setPhoneStep('phone')
      setPhoneNumber('')
      setOtp('')
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-card/95 backdrop-blur-md border-2" style={{ borderColor: 'hsl(var(--accent))' }}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-thai" style={{ color: 'hsl(var(--accent))' }}>
            {mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครใช้งาน'}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground text-thai">
            {mode === 'login' 
              ? 'เข้าสู่ระบบเพื่อเริ่มใช้งาน Freejob' 
              : 'สร้างบัญชีใหม่เพื่อเริ่มใช้งาน Freejob'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {/* Social Login Buttons */}
          {phoneStep === 'phone' && (
            <>
              {/* Google Button */}
              <Button
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
                className="w-full bg-white hover:bg-gray-100 text-gray-900 border-2 border-gray-300 text-thai font-medium"
                style={{ boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 0.1)' }}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบด้วย Google'}
              </Button>

              {/* Facebook Button */}
              <Button
                onClick={() => handleSocialLogin('facebook')}
                disabled={isLoading}
                className="w-full text-white text-thai font-medium"
                style={{
                  backgroundColor: '#1877F2',
                  boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 0.1)'
                }}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                )}
                {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบด้วย Facebook'}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{ borderColor: 'hsl(var(--accent))' }}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground text-thai">หรือ</span>
                </div>
              </div>
            </>
          )}

          {/* Phone Number Input */}
          {phoneStep === 'phone' ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-card-foreground text-thai mb-2 block">
                  หมายเลขโทรศัพท์
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 border-2 rounded-lg bg-secondary text-card-foreground text-thai" style={{ borderColor: 'hsl(var(--accent))' }}>
                    +66
                  </div>
                  <Input
                    type="tel"
                    placeholder="812345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 text-thai bg-card text-card-foreground border-2"
                    style={{ borderColor: 'hsl(var(--accent))' }}
                    maxLength={9}
                  />
                </div>
              </div>
              <Button
                onClick={handleSendOTP}
                disabled={isSendingOTP || !phoneNumber || phoneNumber.length < 9}
                className="w-full text-thai font-bold"
                style={{
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                  boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 0.2)'
                }}
              >
                {isSendingOTP ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    กำลังส่งรหัส OTP...
                  </>
                ) : (
                  'ขอรหัส OTP'
                )}
              </Button>
            </div>
          ) : (
            /* OTP Input */
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-card-foreground text-thai mb-2 block">
                  รหัส OTP (6 หลัก)
                </label>
                <Input
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-2xl tracking-widest text-thai bg-card text-card-foreground border-2"
                  style={{ borderColor: 'hsl(var(--accent))' }}
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground text-thai mt-2 text-center">
                  รหัส OTP ถูกส่งไปยัง +66{phoneNumber}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setPhoneStep('phone')
                    setOtp('')
                  }}
                  variant="outline"
                  className="flex-1 text-thai border-accent"
                >
                  เปลี่ยนหมายเลข
                </Button>
                <Button
                  onClick={handleVerifyOTP}
                  disabled={isLoading || otp.length !== 6}
                  className="flex-1 text-thai font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                    boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      กำลังยืนยัน...
                    </>
                  ) : (
                    'ยืนยันรหัส OTP'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground text-thai">
            {mode === 'login' ? (
              <>
                ยังไม่มีบัญชี?{' '}
                <button
                  onClick={() => {
                    // Switch to signup mode - you can implement this
                    alert('เปลี่ยนเป็นโหมดสมัครใช้งาน')
                  }}
                  className="underline hover:text-accent-foreground"
                  style={{ color: 'hsl(var(--accent))' }}
                >
                  สมัครใช้งาน
                </button>
              </>
            ) : (
              <>
                มีบัญชีอยู่แล้ว?{' '}
                <button
                  onClick={() => {
                    // Switch to login mode
                    alert('เปลี่ยนเป็นโหมดเข้าสู่ระบบ')
                  }}
                  className="underline hover:text-accent-foreground"
                  style={{ color: 'hsl(var(--accent))' }}
                >
                  เข้าสู่ระบบ
                </button>
              </>
            )}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
