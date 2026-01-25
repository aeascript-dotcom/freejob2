'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface ContractData {
  jobTitle: string
  price: number
  duration: string
}

interface ContractModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
  contractData: ContractData
}

export function ContractModal({ isOpen, onClose, onAccept, contractData }: ContractModalProps) {
  const handleAccept = () => {
    onAccept()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-md border-2" style={{ borderColor: 'hsl(var(--accent))' }}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-thai" style={{ color: 'hsl(var(--accent))' }}>
            สัญญาจ้างและชำระเงิน
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground text-thai">
            กรุณาอ่านและยอมรับเงื่อนไขก่อนดำเนินการชำระเงิน
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Job Summary */}
          <div className="p-4 rounded-lg border-2" style={{ borderColor: 'hsl(var(--accent))', backgroundColor: 'rgba(255, 215, 0, 0.05)' }}>
            <h3 className="font-semibold text-card-foreground text-thai mb-3" style={{ color: 'hsl(var(--accent))' }}>
              สรุปงาน
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-thai">ชื่องาน:</span>
                <span className="text-card-foreground font-medium text-thai">{contractData.jobTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-thai">ราคา:</span>
                <span className="text-card-foreground font-bold text-thai" style={{ color: 'hsl(var(--accent))' }}>
                  {formatCurrency(contractData.price)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-thai">ระยะเวลา:</span>
                <span className="text-card-foreground font-medium text-thai">{contractData.duration}</span>
              </div>
            </div>
          </div>

          {/* Contract Terms */}
          <div className="space-y-4">
            <h3 className="font-semibold text-card-foreground text-thai" style={{ color: 'hsl(var(--accent))' }}>
              เงื่อนไขสัญญา
            </h3>
            <div className="bg-card/50 border-2 rounded-lg p-4 space-y-3" style={{ borderColor: 'hsl(var(--accent))' }}>
              <p className="text-sm text-card-foreground text-thai leading-relaxed">
                <strong>ข้อ 1:</strong> ผู้ว่าจ้างตกลงชำระเงินเต็มจำนวน {formatCurrency(contractData.price)} 
                ภายใน 24 ชั่วโมงหลังจากอนุมัติใบเสนอราคา
              </p>
              <p className="text-sm text-card-foreground text-thai leading-relaxed">
                <strong>ข้อ 2:</strong> ฟรีแลนซ์ตกลงส่งมอบงานภายใน {contractData.duration} 
                หลังจากได้รับยอดเงินครบถ้วน
              </p>
              <p className="text-sm text-card-foreground text-thai leading-relaxed">
                <strong>ข้อ 3:</strong> ฟรีแลนซ์จะส่งงานให้ผู้ว่าจ้างตรวจสอบและขอแก้ไขได้ไม่เกิน 2 ครั้ง
              </p>
              <p className="text-sm text-card-foreground text-thai leading-relaxed">
                <strong>ข้อ 4:</strong> หากผู้ว่าจ้างต้องการแก้ไขเพิ่มเติมเกิน 2 ครั้ง 
                จะต้องชำระค่าบริการเพิ่มเติมตามที่ตกลงกัน
              </p>
              <p className="text-sm text-card-foreground text-thai leading-relaxed">
                <strong>ข้อ 5:</strong> งานที่ส่งมอบจะรวมไฟล์ต้นฉบับและสิทธิ์ใช้งานเชิงพาณิชย์
              </p>
            </div>
          </div>

          {/* Payment Method (Mock) */}
          <div className="p-4 rounded-lg border-2" style={{ borderColor: 'hsl(var(--accent))', backgroundColor: 'rgba(255, 215, 0, 0.05)' }}>
            <h3 className="font-semibold text-card-foreground text-thai mb-2" style={{ color: 'hsl(var(--accent))' }}>
              วิธีชำระเงิน
            </h3>
            <p className="text-sm text-muted-foreground text-thai">
              ระบบจะจำลองการชำระเงินอัตโนมัติเมื่อคุณคลิก "ยอมรับเงื่อนไขและชำระเงิน"
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 text-thai border-accent"
          >
            ยกเลิก
          </Button>
          <Button
            onClick={handleAccept}
            className="flex-1 text-thai font-bold"
            style={{
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
              color: '#FFFFFF',
              boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 0.2)'
            }}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            ยอมรับเงื่อนไขและชำระเงิน
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
