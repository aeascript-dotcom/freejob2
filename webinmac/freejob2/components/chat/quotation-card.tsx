'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, X } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface QuotationData {
  id: string
  jobTitle: string
  scope: string[]
  price: number
  duration: string
}

interface QuotationCardProps {
  quotationData: QuotationData
  onApprove?: () => void
  onDecline?: () => void
  jobStatus?: 'negotiating' | 'quoted' | 'working'
}

export function QuotationCard({ quotationData, onApprove, onDecline, jobStatus = 'negotiating' }: QuotationCardProps) {
  const [isApproved, setIsApproved] = useState(false)
  
  // Update approved state when job status changes to 'working'
  useEffect(() => {
    if (jobStatus === 'working') {
      setIsApproved(true)
    }
  }, [jobStatus])

  const handleApprove = () => {
    setIsApproved(true)
    onApprove?.()
  }

  const handleDecline = () => {
    onDecline?.()
  }

  if (isApproved) {
    return (
      <div 
        className="max-w-[70%] rounded-lg p-4 border-2"
        style={{
          backgroundColor: 'hsl(142, 76%, 36%)', // green-600
          borderColor: 'hsl(142, 76%, 36%)',
          boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 0.2)'
        }}
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="text-white font-bold text-thai">✅ ชำระเงินแล้ว (Paid)</span>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="max-w-[70%] rounded-lg p-5 border-2"
      style={{
        backgroundColor: 'hsl(0, 0%, 9%)', // zinc-900
        borderColor: 'rgba(245, 158, 11, 0.5)', // amber-500/50
        boxShadow: '4px 4px 0px 0px rgba(245, 158, 11, 0.2)'
      }}
    >
      {/* Header */}
      <div className="mb-4 pb-3 border-b" style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
        <h3 
          className="text-lg font-bold text-thai"
          style={{ color: 'hsl(48, 96%, 53%)' }} // amber-400/gold
        >
          ใบเสนอราคา (Quotation)
        </h3>
      </div>

      {/* Job Title */}
      <div className="mb-4">
        <h4 className="text-base font-semibold text-white text-thai mb-2">
          {quotationData.jobTitle}
        </h4>
      </div>

      {/* Scope List */}
      <div className="mb-4">
        <ul className="space-y-2">
          {quotationData.scope.map((item, idx) => (
            <li key={`scope-${item}-${idx}`} className="flex items-start gap-2">
              <span className="text-amber-400 mt-1">•</span>
              <span className="text-sm text-white text-thai">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Price and Duration */}
      <div className="flex items-center justify-between mb-4 p-3 rounded-lg" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
        <div>
          <p className="text-xs text-muted-foreground text-thai mb-1">ราคา</p>
          <p 
            className="text-3xl font-bold text-thai"
            style={{ color: 'hsl(48, 96%, 53%)' }} // amber-400/gold
          >
            {formatCurrency(quotationData.price)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground text-thai mb-1">ระยะเวลา</p>
          <p className="text-lg font-semibold text-white text-thai">{quotationData.duration}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="ghost"
          onClick={handleDecline}
          className="flex-1 text-thai text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <X className="w-4 h-4 mr-2" />
          ปฏิเสธ
        </Button>
        <Button
          onClick={handleApprove}
          className="flex-1 text-thai font-bold"
          style={{
            background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
            color: '#FFFFFF',
            boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 0.2)'
          }}
        >
          อนุมัติและชำระเงิน
        </Button>
      </div>
    </div>
  )
}
