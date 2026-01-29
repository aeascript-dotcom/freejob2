'use client'

import { useEffect } from 'react'
import { useToast } from '@/context/toast-context'
import type { ToastType } from '@/context/toast-context'
import { LINE_TOAST_EVENT } from '@/context/line-context'

export function LineToastBridge() {
  const { showToast } = useToast()

  useEffect(() => {
    const handler = (e: Event) => {
      const d = (e as CustomEvent<{ message: string; type?: ToastType }>).detail
      if (!d?.message) return
      showToast(d.message, d.type ?? 'info')
    }
    window.addEventListener(LINE_TOAST_EVENT, handler)
    return () => window.removeEventListener(LINE_TOAST_EVENT, handler)
  }, [showToast])

  return null
}
