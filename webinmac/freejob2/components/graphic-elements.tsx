'use client'

interface HazardStripeProps {
  className?: string
}

export function HazardStripe({ className = '' }: HazardStripeProps) {
  return <div className={`hazard-stripe ${className}`} />
}

interface GridBackgroundProps {
  className?: string
}

export function GridBackground({ className = '' }: GridBackgroundProps) {
  return <div className={`grid-background absolute inset-0 ${className}`} />
}

interface CircularBadgeProps {
  children: React.ReactNode
  className?: string
}

export function CircularBadge({ children, className = '' }: CircularBadgeProps) {
  return (
    <div className={`badge-circle inline-flex items-center justify-center ${className}`}>
      {children}
    </div>
  )
}

interface SeparatorBoldProps {
  className?: string
}

export function SeparatorBold({ className = '' }: SeparatorBoldProps) {
  return <hr className={`separator-bold ${className}`} />
}
