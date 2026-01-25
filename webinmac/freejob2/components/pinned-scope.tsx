'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Deal } from '@/types/database'
import { Lock, Unlock } from 'lucide-react'

interface PinnedScopeProps {
  deal: Deal
  canEdit: boolean
  onUpdate?: (scope: string) => void
}

export function PinnedScope({ deal, canEdit, onUpdate }: PinnedScopeProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <span>ขอบเขตงานที่ตกลงกัน</span>
            {deal.scope_locked ? (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                ล็อคแล้ว
              </Badge>
            ) : (
              <Badge variant="outline" className="flex items-center gap-1">
                <Unlock className="w-3 h-3" />
                แก้ไขได้
              </Badge>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {deal.current_scope ? (
          <p className="text-sm whitespace-pre-wrap text-muted-foreground">
            {deal.current_scope}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            ยังไม่ได้กำหนดขอบเขตงาน
          </p>
        )}
      </CardContent>
    </Card>
  )
}
