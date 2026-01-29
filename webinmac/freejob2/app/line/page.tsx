'use client'

import { useState, useRef, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { GridBackground } from '@/components/graphic-elements'
import { Container } from '@/components/container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLine } from '@/context/line-context'
import { LineIcon } from '@/components/line/line-icon'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, Loader2 } from 'lucide-react'

const LINE_GREEN = '#06C755'

export default function LinePage() {
  const {
    isLineConnected,
    lineProfile,
    adminMessages,
    connectLine,
    disconnectLine,
    sendMessageToAdmin,
  } = useLine()
  const [input, setInput] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  useEffect(() => {
    scrollToBottom()
  }, [adminMessages])

  const handleConnect = async () => {
    setConnecting(true)
    try {
      await connectLine()
    } finally {
      setConnecting(false)
    }
  }

  const handleSend = async () => {
    const t = input.trim()
    if (!t || sending) return
    setSending(true)
    setInput('')
    try {
      await sendMessageToAdmin(t)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-background relative">
      <GridBackground />
      <Navbar />

      <main className="container mx-auto px-4 py-8 sm:py-12 relative z-10">
        <Container className="max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-thai" style={{ color: 'hsl(var(--accent))' }}>
            LINE แชทกับแอดมิน
          </h1>
          <p className="text-muted-foreground text-thai mb-8">
            เชื่อมต่อ LINE เพื่อรับการแจ้งเตือนและแชทกับแอดมิน
          </p>

          {/* Connect / Disconnect */}
          <Card className="card-black border-2 mb-8">
            <CardHeader>
              <CardTitle className="text-thai text-lg">สถานะการเชื่อมต่อ</CardTitle>
              <CardDescription className="text-thai text-muted-foreground">
                {isLineConnected
                  ? 'บัญชี LINE ของคุณเชื่อมต่อแล้ว'
                  : 'เชื่อมต่อ LINE เพื่อเริ่มแชทกับแอดมิน'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLineConnected && lineProfile ? (
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div
                    className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 ring-2 ring-[var(--line-green)] bg-muted"
                    style={{ borderColor: 'var(--line-green)' }}
                  >
                    <img
                      src={lineProfile.pictureUrl}
                      alt={lineProfile.displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <p className="font-semibold text-thai text-foreground">{lineProfile.displayName}</p>
                    <p className="text-sm text-muted-foreground text-thai">LINE เข้าสู่ระบบแล้ว</p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-2 border-amber-500/80 text-amber-500 hover:bg-amber-500/10 hover:border-amber-500"
                    onClick={disconnectLine}
                  >
                    ยกเลิกการเชื่อมต่อ
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--line-green)' }}
                  >
                    <LineIcon size={28} className="text-white" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-thai text-muted-foreground mb-2">
                      กดปุ่มด้านล่างเพื่อเชื่อมต่อบัญชี LINE
                    </p>
                    <Button
                      className="font-semibold text-white hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: LINE_GREEN }}
                      onClick={handleConnect}
                      disabled={connecting}
                    >
                      {connecting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <LineIcon size={20} className="mr-2 text-white" />
                      )}
                      เชื่อมต่อ LINE
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat (show when connected) */}
          {isLineConnected && (
            <Card className="card-black border-2">
              <CardHeader>
                <CardTitle className="text-thai flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" style={{ color: 'var(--line-green)' }} />
                  แชทกับแอดมิน
                </CardTitle>
                <CardDescription className="text-thai text-muted-foreground">
                  ส่งข้อความหาแอดมิน ได้รับการตอบกลับโดยเร็ว
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="rounded-xl border border-white/10 bg-black/40 p-4 min-h-[240px] max-h-[360px] overflow-y-auto space-y-3"
                  style={{ scrollbarColor: 'hsl(var(--accent)) transparent' }}
                >
                  {adminMessages.length === 0 ? (
                    <p className="text-center text-muted-foreground text-thai py-8">
                      ยังไม่มีข้อความ ส่งข้อความแรกเลย
                    </p>
                  ) : (
                    adminMessages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-thai ${
                            m.sender === 'user'
                              ? 'rounded-br-md bg-amber-500/20 border border-amber-500/40 text-foreground'
                              : 'rounded-bl-md bg-[var(--line-green)]/20 border border-[var(--line-green)]/50 text-foreground'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">{m.text}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {new Date(m.timestamp).toLocaleTimeString('th-TH', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="พิมพ์ข้อความ..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    className="flex-1 bg-card border-2 border-input text-card-foreground placeholder:text-muted-foreground"
                    disabled={sending}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={sending || !input.trim()}
                    className="px-6"
                    style={{ backgroundColor: LINE_GREEN }}
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ส่ง'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </Container>
      </main>
    </div>
  )
}
