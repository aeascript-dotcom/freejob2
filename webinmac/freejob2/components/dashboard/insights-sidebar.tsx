'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus, ArrowUp, ArrowDown } from 'lucide-react'

interface TopCategory {
  name: string
  requests: number
  trend: 'up' | 'down' | 'stable'
}

interface MarketPriceRange {
  lowest: number
  highest: number
  average: number
  userRate: number
  category: string
}

interface QuoteConversion {
  successRate: number
  missedRate: number
  insight: string
}

// Mock data for Widget 1
const topCategories: TopCategory[] = [
  { name: 'กราฟิกและดีไซน์', requests: 150, trend: 'up' },
  { name: 'การตลาดออนไลน์', requests: 120, trend: 'up' },
  { name: 'เขียนโปรแกรม', requests: 90, trend: 'stable' },
  { name: 'ตัดต่อวิดีโอ', requests: 85, trend: 'stable' },
  { name: 'แปลภาษา', requests: 60, trend: 'down' },
]

// Mock data for Widget 2
const marketPriceRange: MarketPriceRange = {
  lowest: 500,
  highest: 15000,
  average: 3500,
  userRate: 500, // Assume current user rate
  category: 'Graphic Design',
}

// Mock data for Widget 3
const quoteConversion: QuoteConversion = {
  successRate: 15,
  missedRate: 85,
  insight: 'คุณพลาดงานไป 85% ลองปรับลดราคาลงเล็กน้อย หรือเพิ่มรายละเอียดในใบเสนอราคาเพื่อดึงดูดลูกค้ามากขึ้น',
}

export function InsightsSidebar() {
  // Calculate position of user rate in the range (0-100%)
  const userRatePosition = ((marketPriceRange.userRate - marketPriceRange.lowest) / 
    (marketPriceRange.highest - marketPriceRange.lowest)) * 100

  // Calculate donut chart values for Widget 3
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const successPercentage = quoteConversion.successRate / 100
  const successDashArray = circumference * successPercentage
  const successDashOffset = circumference - successDashArray

  return (
    <div className="space-y-6">
      {/* Widget 1: Top 5 Job Categories */}
      <Card className="card-black border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-thai" style={{ color: 'hsl(var(--accent))' }}>
            🔥 5 อันดับงานมาแรง
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topCategories.map((category, index) => (
              <div
                key={category.name}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: 'rgba(255, 215, 0, 0.05)' }}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm"
                    style={{
                      backgroundColor: index === 0 ? 'hsl(var(--accent))' : 'transparent',
                      color: index === 0 ? '#000000' : 'hsl(var(--accent))',
                      border: index === 0 ? 'none' : '2px solid hsl(var(--accent))',
                    }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground text-thai truncate">
                      {category.name}
                    </p>
                    <p className="text-xs text-muted-foreground text-thai">
                      {category.requests} requests
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {category.trend === 'up' && (
                    <div className="flex items-center gap-1 text-green-400">
                      <TrendingUp className="w-4 h-4" />
                      <ArrowUp className="w-3 h-3" />
                    </div>
                  )}
                  {category.trend === 'down' && (
                    <div className="flex items-center gap-1 text-red-400">
                      <TrendingDown className="w-4 h-4" />
                      <ArrowDown className="w-3 h-3" />
                    </div>
                  )}
                  {category.trend === 'stable' && (
                    <div className="flex items-center gap-1 text-gray-400">
                      <Minus className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Widget 2: Market Price Range */}
      <Card className="card-black border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-thai" style={{ color: 'hsl(var(--accent))' }}>
            💰 เรทราคาตลาด (Market Price Range)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground text-thai mb-2">
                Based on your category: {marketPriceRange.category}
              </p>
              
              {/* Price Range Display */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-card-foreground text-thai">
                    Lowest: <span style={{ color: 'hsl(var(--accent))' }}>฿{marketPriceRange.lowest.toLocaleString()}</span>
                  </span>
                  <span className="text-card-foreground text-thai">
                    Highest: <span style={{ color: 'hsl(var(--accent))' }}>฿{marketPriceRange.highest.toLocaleString()}</span>
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-card-foreground text-thai">
                    Average: <span className="text-lg font-bold" style={{ color: 'hsl(var(--accent))' }}>฿{marketPriceRange.average.toLocaleString()}</span>
                  </span>
                </div>
              </div>

              {/* Visual Range Bar */}
              <div className="relative">
                <div
                  className="h-3 rounded-full"
                  style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)' }}
                >
                  <div
                    className="h-full rounded-full relative"
                    style={{
                      width: `${userRatePosition}%`,
                      background: 'linear-gradient(90deg, hsl(var(--accent)) 0%, rgba(255, 215, 0, 0.5) 100%)',
                    }}
                  >
                    <div
                      className="absolute -right-2 -top-1 w-5 h-5 rounded-full border-2"
                      style={{
                        backgroundColor: 'hsl(var(--accent))',
                        borderColor: '#000000',
                        boxShadow: '0 0 0 2px hsl(var(--accent))',
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground text-thai">
                  <span>฿{marketPriceRange.lowest}</span>
                  <span className="font-bold" style={{ color: 'hsl(var(--accent))' }}>
                    คุณ: ฿{marketPriceRange.userRate}/hr
                  </span>
                  <span>฿{marketPriceRange.highest}</span>
                </div>
              </div>
            </div>

            {/* Mandatory Disclaimer */}
            <div className="pt-4 border-t" style={{ borderColor: 'rgba(255, 215, 0, 0.3)' }}>
              <p className="text-xs text-muted-foreground text-thai leading-relaxed italic">
                *ราคาค่าแรงนี้ เป็นข้อมูลเฉพาะ web นี้เท่านั้น ไม่ได้เป็นราคาในตลาดรวมทั้งประเทศ
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Widget 3: Quote Conversion Analysis */}
      <Card className="card-black border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-thai" style={{ color: 'hsl(var(--accent))' }}>
            📉 วิเคราะห์การเสนอราคา (Quote Conversion)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Donut Chart */}
            <div className="flex justify-center">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  {/* Background circle */}
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    fill="none"
                    stroke="rgba(255, 215, 0, 0.1)"
                    strokeWidth="12"
                  />
                  {/* Success rate (green) - starts from top */}
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    fill="none"
                    stroke="#86efac"
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={successDashOffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                  />
                  {/* Missed rate (red) - continues from success */}
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (circumference * (quoteConversion.missedRate / 100))}
                    strokeLinecap="round"
                    style={{
                      transition: 'stroke-dashoffset 0.5s ease',
                      transform: `rotate(${360 * successPercentage}deg)`,
                      transformOrigin: '64px 64px',
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-card-foreground">
                      {quoteConversion.successRate}%
                    </div>
                    <div className="text-xs text-muted-foreground text-thai">Success</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: 'rgba(134, 239, 172, 0.1)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-sm text-card-foreground text-thai">Hired</span>
                </div>
                <span className="text-sm font-bold text-card-foreground">{quoteConversion.successRate}%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="text-sm text-card-foreground text-thai">Missed Opportunity</span>
                </div>
                <span className="text-sm font-bold text-card-foreground">{quoteConversion.missedRate}%</span>
              </div>
            </div>

            {/* Insight Text */}
            <div className="pt-4 border-t" style={{ borderColor: 'rgba(255, 215, 0, 0.3)' }}>
              <p className="text-sm text-card-foreground text-thai leading-relaxed">
                {quoteConversion.insight}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
