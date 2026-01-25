'use client'

interface GridBackgroundProps {
  className?: string
}

export function GridBackground({ className = '' }: GridBackgroundProps) {
  return <div className={`grid-background absolute inset-0 ${className}`} />
}

interface SeparatorBoldProps {
  className?: string
}

export function SeparatorBold({ className = '' }: SeparatorBoldProps) {
  return <hr className={`separator-bold ${className}`} />
}
