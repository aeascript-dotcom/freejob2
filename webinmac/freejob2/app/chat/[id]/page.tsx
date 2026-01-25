'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Send, ArrowLeft, Circle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useChatScenario } from '@/hooks/useChatScenario'
import { Message } from '@/types/chat'
import { QuotationCard } from '@/components/chat/quotation-card'
import { ContractModal } from '@/components/chat/contract-modal'
import { mockFreelancers } from '@/lib/mock-data'
import { formatTime, formatDate } from '@/lib/utils'

type JobStatus = 'negotiating' | 'quoted' | 'working'

// Mock data for active chats
const mockActiveChats = [
  {
    id: 'chat-1',
    name: 'สมชาย ใจดี',
    avatar: '/character/a1.png',
    lastMessage: 'สวัสดีครับ ผมสนใจงานนี้',
    timestamp: '10 นาทีที่แล้ว',
    unread: 2,
    isOnline: true
  },
  {
    id: 'chat-2',
    name: 'วิภา รักงาน',
    avatar: '/character/a2.png',
    lastMessage: 'ขอบคุณสำหรับข้อมูล',
    timestamp: '1 ชั่วโมงที่แล้ว',
    unread: 0,
    isOnline: false
  },
  {
    id: 'chat-3',
    name: 'ประเสริฐ ทนาย',
    avatar: '/character/a5.png',
    lastMessage: 'พร้อมเริ่มงานได้เลย',
    timestamp: '2 ชั่วโมงที่แล้ว',
    unread: 1,
    isOnline: true
  },
  {
    id: 'chat-4',
    name: 'มานี รักการออกแบบ',
    avatar: '/character/a2.png',
    lastMessage: 'ขอรายละเอียดเพิ่มเติม',
    timestamp: '3 ชั่วโมงที่แล้ว',
    unread: 0,
    isOnline: false
  }
]

// Mock data for current chat
const mockCurrentChat = {
  id: 'mock-id-123',
  name: 'สมชาย ใจดี',
  avatar: '/character/a1.png',
  status: 'Online',
  isOnline: true
}

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const chatId = (params?.id as string) || ''
  const [inputMessage, setInputMessage] = useState('')
  const [activeChats] = useState(mockActiveChats)
  const [jobStatus, setJobStatus] = useState<JobStatus>('negotiating')
  const [isContractModalOpen, setIsContractModalOpen] = useState(false)
  const [currentQuotation, setCurrentQuotation] = useState<{ jobTitle: string; price: number; duration: string } | null>(null)
  
  // Find freelancer data based on chat ID
  const freelancer = mockFreelancers.find(f => f.id === chatId) || mockFreelancers[0]
  const currentChat = {
    id: chatId,
    name: freelancer?.full_name || 'ฟรีแลนซ์',
    avatar: freelancer?.avatar_url || '/character/a1.png',
    status: freelancer?.availability_status === 'available' ? 'Online' : 'Offline',
    isOnline: freelancer?.availability_status === 'available'
  }

  // Use chat scenario hook
  const { messages, sendMessage, isTyping } = useChatScenario({
    freelancerName: currentChat.name,
    jobStatus,
    onJobStatusChange: setJobStatus
  })

  // Calculate due date (3 days from now) - use useEffect to avoid hydration issues
  const [dueDate, setDueDate] = useState<Date | null>(null)

  useEffect(() => {
    const calculateDueDate = () => {
      const date = new Date()
      date.setDate(date.getDate() + 3)
      return date
    }
    setDueDate(calculateDueDate())
  }, [])

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return
    
    sendMessage(inputMessage)
    setInputMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Active Chats (25%) */}
        <aside className="w-1/4 border-r border-border bg-card/50 overflow-y-auto">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-bold text-card-foreground text-thai heading-english">
              แชทที่กำลังใช้งาน
            </h2>
          </div>
          
          <div className="divide-y divide-border">
            {activeChats.map((chat) => (
              <Link
                key={chat.id}
                href={`/chat/${chat.id}`}
                className={`block p-4 hover:bg-secondary/50 transition-colors ${
                  chat.id === chatId ? 'bg-secondary/30' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={chat.avatar} alt={chat.name} />
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        {chat.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {chat.isOnline && (
                      <Circle className="absolute -bottom-1 -right-1 w-4 h-4 fill-green-400 text-green-400 border-2 border-card rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm text-card-foreground text-thai truncate">
                        {chat.name}
                      </h3>
                      {chat.unread > 0 && (
                        <Badge className="bg-accent text-accent-foreground text-xs px-1.5 py-0.5 min-w-[20px] text-center">
                          {chat.unread}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground text-thai truncate">
                      {chat.lastMessage}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {chat.timestamp}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </aside>

        {/* Main Chat Area (75%) */}
        <main className="flex-1 flex flex-col bg-background">
          {/* Chat Header */}
          <header className="border-b border-border bg-card/50 p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/search">
                <Button variant="ghost" size="icon" className="text-card-foreground">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={currentChat.avatar} alt={currentChat.name} />
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    {currentChat.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {currentChat.isOnline && (
                  <Circle className="absolute -bottom-1 -right-1 w-4 h-4 fill-green-400 text-green-400 border-2 border-card rounded-full" />
                )}
              </div>
              <div>
                <h1 className="text-lg font-bold text-card-foreground text-thai">
                  {currentChat.name}
                </h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge 
                    className="text-xs px-2 py-0.5"
                    style={{
                      backgroundColor: currentChat.isOnline ? '#86efac' : '#9ca3af',
                      color: currentChat.isOnline ? '#000000' : '#ffffff'
                    }}
                  >
                    {currentChat.status}
                  </Badge>
                  {jobStatus === 'working' && (
                    <>
                      <Badge 
                        className="text-xs px-2 py-0.5 text-thai"
                        style={{
                          backgroundColor: '#86efac',
                          color: '#000000'
                        }}
                      >
                        🟢 กำลังเริ่มงาน (Work in Progress)
                      </Badge>
                      {dueDate && (
                        <Badge 
                          className="text-xs px-2 py-0.5 text-thai"
                          variant="outline"
                          style={{
                            borderColor: 'hsl(var(--accent))',
                            color: 'hsl(var(--accent))'
                          }}
                        >
                          ส่งงานใน {formatDate(dueDate)}
                        </Badge>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" style={{ color: 'hsl(var(--accent))' }} />
                  <p className="text-muted-foreground text-thai text-sm">
                    กำลังโหลดการสนทนา...
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg: Message) => {
                  // Render Quotation Card for quotation type
                  if (msg.type === 'quotation' && msg.quotationData) {
                    return (
                      <div
                        key={msg.id}
                        className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300"
                      >
                        <QuotationCard
                          quotationData={msg.quotationData}
                          jobStatus={jobStatus}
                          onApprove={() => {
                            setCurrentQuotation({
                              jobTitle: msg.quotationData!.jobTitle,
                              price: msg.quotationData!.price,
                              duration: msg.quotationData!.duration
                            })
                            setJobStatus('quoted')
                            setIsContractModalOpen(true)
                          }}
                          onDecline={() => {
                            // Handle decline - can be extended in future
                          }}
                        />
                      </div>
                    )
                  }

                  // Render regular text message
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-4 ${
                          msg.sender === 'user'
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-card border-2 text-card-foreground'
                        }`}
                        style={
                          msg.sender === 'user'
                            ? {
                                backgroundColor: 'hsl(var(--accent))',
                                color: 'hsl(var(--accent-foreground))',
                                boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 0.2)'
                              }
                            : {
                                borderColor: 'hsl(var(--accent))',
                                boxShadow: '4px 4px 0px 0px rgba(255, 215, 0, 0.1)'
                              }
                        }
                      >
                        {msg.text && (
                          <p className="text-thai whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                        )}
                        <p className="text-xs mt-2 opacity-70">
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  )
                })}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div 
                      className="bg-card border-2 border-accent rounded-lg p-4"
                      style={{
                        borderColor: 'hsl(var(--accent))',
                        boxShadow: '4px 4px 0px 0px rgba(255, 215, 0, 0.1)'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'hsl(var(--accent))' }} />
                        <span className="text-sm text-muted-foreground text-thai">
                          {currentChat.name} กำลังพิมพ์...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chat Input Footer */}
          <footer className="border-t border-border bg-card/50 p-4">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="พิมพ์ข้อความ..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isTyping}
                className="flex-1 text-thai bg-card text-card-foreground border-2"
                style={{ borderColor: 'hsl(var(--accent))' }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="text-thai"
                style={{
                  backgroundColor: 'hsl(var(--accent))',
                  color: 'hsl(var(--accent-foreground))',
                  boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 0.2)'
                }}
              >
                <Send className="w-4 h-4 mr-2" />
                ส่ง
              </Button>
            </div>
          </footer>
        </main>
      </div>

      {/* Contract Modal */}
      {currentQuotation && (
        <ContractModal
          isOpen={isContractModalOpen}
          onClose={() => setIsContractModalOpen(false)}
          onAccept={() => {
            setJobStatus('working')
          }}
          contractData={currentQuotation}
        />
      )}
    </div>
  )
}
