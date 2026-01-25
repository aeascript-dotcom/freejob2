'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Message, QuotationData } from '@/types/chat'
import { generateId } from '@/lib/utils'

interface UseChatScenarioOptions {
  freelancerName?: string
  jobStatus?: 'negotiating' | 'quoted' | 'working'
  onJobStatusChange?: (status: 'negotiating' | 'quoted' | 'working') => void
}

export function useChatScenario(options: UseChatScenarioOptions = {}) {
  const { freelancerName = 'ฟรีแลนซ์', jobStatus = 'negotiating', onJobStatusChange } = options
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [hasReceivedFirstMessage, setHasReceivedFirstMessage] = useState(false)
  const [hasSentQuotation, setHasSentQuotation] = useState(false)
  const [hasSentWorkStartMessage, setHasSentWorkStartMessage] = useState(false)
  const timeoutRefs = useRef<NodeJS.Timeout[]>([])
  const hasGreetedRef = useRef(false)
  const prevJobStatusRef = useRef(jobStatus)

  // Generate unique message ID
  const generateMessageId = useCallback(() => {
    return generateId('msg')
  }, [])

  // Send quotation message
  const sendQuotation = useCallback(() => {
    const quotationData: QuotationData = {
      id: `quote-${Date.now()}`,
      jobTitle: 'ออกแบบโลโก้ Minimal Style',
      scope: [
        '3 Drafts (3 แบบร่าง)',
        'Source Files (ไฟล์ต้นฉบับ)',
        'Commercial Use (ใช้งานเชิงพาณิชย์ได้)',
        '2 Revisions (แก้ไข 2 ครั้ง)'
      ],
      price: 3500,
      duration: '3 วัน'
    }

    const quotationMessage: Message = {
      id: generateMessageId(),
      sender: 'freelancer',
      text: '', // Empty text for quotation type
      type: 'quotation',
      timestamp: new Date(),
      quotationData
    }

    setMessages(prev => [...prev, quotationMessage])
    setHasSentQuotation(true)

    // After 2 seconds, send follow-up text
    const followUpTimeout = setTimeout(() => {
      const followUpMessage: Message = {
        id: generateMessageId(),
        sender: 'freelancer',
        text: 'อันนี้เป็นรายละเอียดและราคาครับ ถ้าโอเคกดอนุมัติได้เลยครับ',
        type: 'text',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, followUpMessage])
    }, 2000)

    timeoutRefs.current.push(followUpTimeout)
  }, [generateMessageId])

  // Send user message
  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: generateMessageId(),
      sender: 'user',
      text: text.trim(),
      type: 'text',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    
    // If this is the first user message, trigger the acknowledgment response
    if (!hasReceivedFirstMessage) {
      setHasReceivedFirstMessage(true)
      setIsTyping(true)
      
      // Wait 3 seconds (as per requirement: "On User Reply: Wait 3s")
      const delay = 3000
      
      const timeout = setTimeout(() => {
        setIsTyping(false)
        
        const acknowledgmentMessage: Message = {
          id: generateMessageId(),
          sender: 'freelancer',
          text: 'เข้าใจแล้วครับ เดี๋ยวผมทำใบเสนอราคาให้นะครับ...',
          type: 'text',
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, acknowledgmentMessage])

        // After 2 seconds, send quotation (as per requirement: "Wait 2s -> Bot sends a Message with type: 'quotation'")
        if (!hasSentQuotation) {
          const quotationTimeout = setTimeout(() => {
            setIsTyping(true)
            const innerTimeout = setTimeout(() => {
              setIsTyping(false)
              sendQuotation()
            }, 1000)
            timeoutRefs.current.push(innerTimeout)
          }, 2000)
          timeoutRefs.current.push(quotationTimeout)
        }
      }, delay)
      
      timeoutRefs.current.push(timeout)
    }
  }, [generateMessageId, hasReceivedFirstMessage, hasSentQuotation, sendQuotation])

  // Watch for jobStatus change to 'working' and send final message
  useEffect(() => {
    if (jobStatus === 'working' && prevJobStatusRef.current !== 'working' && !hasSentWorkStartMessage) {
      setHasSentWorkStartMessage(true)
      setIsTyping(true)
      
      // Wait 2 seconds, then send work start message
      const timeout = setTimeout(() => {
        setIsTyping(false)
        
        const workStartMessage: Message = {
          id: generateMessageId(),
          sender: 'freelancer',
          text: 'ขอบคุณครับ! ได้รับยอดเงินเรียบร้อยแล้วครับ 🙏 ผมขอเริ่มงานทันที จะอัปเดตความคืบหน้าให้ทราบช่วงเย็นนะครับ',
          type: 'text',
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, workStartMessage])
      }, 2000)
      
      timeoutRefs.current.push(timeout)
      
      return () => {
        clearTimeout(timeout)
        const index = timeoutRefs.current.indexOf(timeout)
        if (index > -1) {
          timeoutRefs.current.splice(index, 1)
        }
      }
    }
    
    prevJobStatusRef.current = jobStatus
  }, [jobStatus, hasSentWorkStartMessage, generateMessageId])

  // Auto greeting on mount (Phase 2 specific)
  useEffect(() => {
    if (!hasGreetedRef.current && messages.length === 0) {
      hasGreetedRef.current = true
      
      // Wait 1 second, then send greeting
      const timeout = setTimeout(() => {
        const greeting: Message = {
          id: generateMessageId(),
          sender: 'freelancer',
          text: 'สวัสดีครับ สนใจงานนี้ครับ ขอทราบรายละเอียดเพิ่มหน่อยครับ?',
          type: 'text',
          timestamp: new Date()
        }
        setMessages([greeting])
      }, 1000)

      timeoutRefs.current.push(timeout)
    }

    return () => {
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout))
      timeoutRefs.current = []
    }
  }, [generateMessageId, messages.length])

  return {
    messages,
    sendMessage,
    isTyping,
    clearMessages: () => {
      setMessages([])
      setHasReceivedFirstMessage(false)
      setHasSentQuotation(false)
      setHasSentWorkStartMessage(false)
      hasGreetedRef.current = false
      prevJobStatusRef.current = 'negotiating'
    }
  }
}
