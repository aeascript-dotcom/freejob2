'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import { ChatLog, Deal, User } from '@/types/database'
import { Send } from 'lucide-react'

interface ChatBoardProps {
  deal: Deal
  currentUserId: string
  otherUser: User
}

export function ChatBoard({ deal, currentUserId, otherUser }: ChatBoardProps) {
  const [messages, setMessages] = useState<ChatLog[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    loadMessages()
    
    // Subscribe to new messages
    const channel = supabase
      .channel(`chat:${deal.id}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'chat_logs', filter: `deal_id=eq.${deal.id}` },
        (payload) => {
          setMessages(prev => [...prev, payload.new as ChatLog])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [deal.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_logs')
        .select('*')
        .eq('deal_id', deal.id)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    try {
      const { error } = await supabase
        .from('chat_logs')
        .insert({
          deal_id: deal.id,
          sender_id: currentUserId,
          message: newMessage.trim()
        })

      if (error) throw error
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('เกิดข้อผิดพลาดในการส่งข้อความ')
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="text-lg">แชท</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="text-center text-muted-foreground">กำลังโหลด...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              ยังไม่มีข้อความ
            </div>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.sender_id === currentUserId
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={isOwn ? undefined : (otherUser.avatar_url || `https://pravatar.cc/150?img=${otherUser.id.slice(0, 2)}`)}
                      alt={isOwn ? 'คุณ' : otherUser.full_name}
                    />
                    <AvatarFallback>
                      {isOwn ? 'คุณ' : otherUser.full_name?.charAt(0)?.toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`flex-1 ${isOwn ? 'text-right' : ''}`}>
                    <div
                      className={`inline-block max-w-[70%] rounded-lg px-4 py-2 ${
                        isOwn
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(msg.created_at).toLocaleTimeString('th-TH', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="พิมพ์ข้อความ..."
            />
            <Button onClick={sendMessage} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
