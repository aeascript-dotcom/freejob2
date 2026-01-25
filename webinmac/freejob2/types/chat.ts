/**
 * Chat Message Types
 */

export type MessageType = 'text' | 'quotation' | 'contract'

export interface QuotationData {
  id: string
  jobTitle: string
  scope: string[]
  price: number
  duration: string
}

export type Message = {
  id: string
  sender: 'user' | 'freelancer'
  text: string
  type: MessageType
  timestamp: Date
  quotationData?: QuotationData
  metadata?: {
    quotationId?: string
    contractId?: string
    [key: string]: unknown
  }
}

export type ChatScenario = {
  trigger: string | RegExp // Keyword or pattern to trigger this response
  response: string | ((userMessage: string) => string) // Response text or function
  delay?: number // Delay in milliseconds before sending (default: 1000-3000)
}
