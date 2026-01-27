'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Container } from '@/components/container'
import { FontSizeSelector } from '@/components/ui/font-size-selector'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PROVINCES } from '@/lib/mock-data'
import { useFreelancer } from '@/context/freelancer-context'
import { useAuth } from '@/context/auth-context'
import { useToast } from '@/context/toast-context'
import { uploadProfileImage } from '@/lib/freelancer-service'
import { Upload, X, Loader2, Save } from 'lucide-react'

export default function FreelancerSettings() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { currentFreelancer, updateProfile, loading: contextLoading } = useFreelancer()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  
  // Form state
  const [displayName, setDisplayName] = useState('')
  const [province, setProvince] = useState('')
  const [bioShort, setBioShort] = useState('')
  const [bioLong, setBioLong] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [hourlyRate, setHourlyRate] = useState<number>(0)
  const [skillInput, setSkillInput] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  
  const skillInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Initialize form with current freelancer data from context
    if (currentFreelancer) {
      setDisplayName(currentFreelancer.full_name || '')
      setProvince(currentFreelancer.province || '')
      setBioShort(currentFreelancer.bio_short || '')
      setBioLong(currentFreelancer.bio_long || '')
      setSkills(currentFreelancer.skills_tags || [])
      setHourlyRate((currentFreelancer as any).hourly_rate || 0)
      setAvatarUrl(currentFreelancer.avatar_url)
    }
  }, [currentFreelancer])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      showToast('ไฟล์ขนาดเกิน 2MB', 'error')
      return
    }

    try {
      setLoading(true)
      // Use service layer for image upload
      const imageUrl = await uploadProfileImage(file)
      setAvatarUrl(imageUrl)
      showToast('อัปโหลดรูปภาพสำเร็จ', 'success')
    } catch (error) {
      console.error('Error uploading image:', error)
      showToast('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault()
      const newSkill = skillInput.trim()
      if (!skills.includes(newSkill)) {
        setSkills([...skills, newSkill])
        setSkillInput('')
      }
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  const handleSave = async () => {
    if (!currentFreelancer) {
      return
    }

    setLoading(true)
    
    try {
      // Prepare updates
      const updates: any = {
        full_name: displayName,
        province: province,
        bio_short: bioShort,
        bio_long: bioLong,
        skills_tags: skills,
      }
      
      // Add hourly_rate if it exists
      if (hourlyRate > 0) {
        updates.hourly_rate = hourlyRate
      }
      
      // Add avatar_url if image was uploaded
      if (avatarUrl) {
        updates.avatar_url = avatarUrl
      }
      
      // Update profile using context (updates state AND localStorage)
      await updateProfile(updates)

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Show success toast
      showToast('บันทึกข้อมูลสำเร็จ', 'success')
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/freelancer/dashboard')
      }, 800)
    } catch (error) {
      console.error('Error saving profile:', error)
      showToast('เกิดข้อผิดพลาดในการบันทึก', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || !user || contextLoading || !currentFreelancer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground text-thai">กำลังโหลด...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <Container className="py-8 max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white mb-6 text-thai heading-english">แก้ไขโปรไฟล์</h1>
          <div className="mb-6">
            <FontSizeSelector />
          </div>
        </div>

        <Card className="bg-zinc-900/50 border border-white/10 hover:border-amber-500/50 transition-colors mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-amber-500 mb-4 text-thai">ข้อมูลพื้นฐาน</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-2 border-amber-500/50">
                <AvatarImage 
                  src={avatarUrl || currentFreelancer.avatar_url || `/character/a1.png`} 
                  alt={displayName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-amber-500 text-black text-2xl">
                  {displayName?.charAt(0)?.toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  className="text-thai border border-zinc-800 text-zinc-400 hover:text-amber-500 hover:border-amber-500/50"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  อัปโหลดรูปภาพ
                </Button>
                <p className="text-xs text-zinc-500 text-thai mt-2">JPG, PNG หรือ GIF (สูงสุด 2MB)</p>
              </div>
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-zinc-400 text-thai">ชื่อที่แสดง</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="กรุณากรอกชื่อที่แสดง"
                className="text-thai bg-zinc-950 border-zinc-800 focus:ring-1 focus:ring-amber-500 text-white placeholder:text-zinc-600"
              />
            </div>

            {/* Province */}
            <div className="space-y-2">
              <Label htmlFor="province" className="text-zinc-400 text-thai">จังหวัด</Label>
              <Select value={province} onValueChange={setProvince}>
                <SelectTrigger id="province" className="text-thai bg-zinc-950 border-zinc-800 focus:ring-1 focus:ring-amber-500 text-white">
                  <SelectValue placeholder="เลือกจังหวัด" />
                </SelectTrigger>
                <SelectContent>
                  {PROVINCES.map((p) => (
                    <SelectItem key={p} value={p} className="text-thai">
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border border-white/10 hover:border-amber-500/50 transition-colors mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-amber-500 mb-4 text-thai">คำอธิบายและรายละเอียด</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Short Bio */}
            <div className="space-y-2">
              <Label htmlFor="bioShort" className="text-zinc-400 text-thai">คำนิยามสั้นๆ</Label>
              <Input
                id="bioShort"
                value={bioShort}
                onChange={(e) => setBioShort(e.target.value)}
                placeholder="เช่น Graphic Designer มือโปร"
                className="text-thai bg-zinc-950 border-zinc-800 focus:ring-1 focus:ring-amber-500 text-white placeholder:text-zinc-600"
              />
              <p className="text-xs text-zinc-500 text-thai">คำอธิบายสั้นๆ ที่จะแสดงในการ์ดโปรไฟล์</p>
            </div>

            {/* About Me */}
            <div className="space-y-2">
              <Label htmlFor="bioLong" className="text-zinc-400 text-thai">เกี่ยวกับฉัน</Label>
              <Textarea
                id="bioLong"
                value={bioLong}
                onChange={(e) => setBioLong(e.target.value)}
                placeholder="บอกเกี่ยวกับตัวคุณ ประสบการณ์ และความเชี่ยวชาญ..."
                rows={6}
                className="text-thai bg-zinc-950 border-zinc-800 focus:ring-1 focus:ring-amber-500 text-white placeholder:text-zinc-600"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border border-white/10 hover:border-amber-500/50 transition-colors mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-amber-500 mb-4 text-thai">ทักษะและความสามารถ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Skill Input */}
            <div className="space-y-2">
              <Label htmlFor="skillInput" className="text-zinc-400 text-thai">เพิ่มทักษะ</Label>
              <Input
                ref={skillInputRef}
                id="skillInput"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="พิมพ์แล้วกด Enter เพื่อเพิ่ม"
                className="text-thai bg-zinc-950 border-zinc-800 focus:ring-1 focus:ring-amber-500 text-white placeholder:text-zinc-600"
              />
              <p className="text-xs text-zinc-500 text-thai">พิมพ์ชื่อทักษะแล้วกด Enter เพื่อเพิ่ม</p>
            </div>

            {/* Skills Display */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 p-4 border border-zinc-800 rounded-lg bg-zinc-950/50">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="default"
                    className="text-sm px-3 py-1 text-thai bg-amber-500 text-black border-0"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 hover:opacity-70"
                      type="button"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border border-white/10 hover:border-amber-500/50 transition-colors mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-amber-500 mb-4 text-thai">อัตราค่าจ้าง</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="hourlyRate" className="text-zinc-400 text-thai">อัตราค่าจ้าง (บาท/ชั่วโมง)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="hourlyRate"
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  placeholder="0"
                  className="text-thai bg-zinc-950 border-zinc-800 focus:ring-1 focus:ring-amber-500 text-white placeholder:text-zinc-600"
                  min="0"
                />
                <span className="text-zinc-400 text-thai">บาท/ชั่วโมง</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sticky Save Button */}
        <div className="sticky bottom-0 bg-black/80 backdrop-blur-md pt-6 pb-6 border-t border-white/10 mt-8">
          <div className="flex gap-4 justify-end">
            <Button
              variant="ghost"
              onClick={() => router.push('/freelancer/dashboard')}
              className="text-thai text-zinc-400 hover:text-white"
              disabled={loading}
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="text-thai font-semibold bg-amber-500 hover:bg-amber-600 text-black"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  บันทึกข้อมูล
                </>
              )}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
