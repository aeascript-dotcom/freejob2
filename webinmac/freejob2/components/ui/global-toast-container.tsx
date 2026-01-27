'use client'

import { useToast } from '@/context/toast-context'
import { ToastContainer } from '@/components/toast'

/**
 * Global Toast Container Component
 * 
 * This component renders all toasts from the ToastContext.
 * Place this once in the root layout.
 */
export function GlobalToastContainer() {
  const { toasts, removeToast } = useToast()

  // Convert context toasts to component format
  const toastItems = toasts.map((toast) => ({
    id: toast.id,
    message: toast.message,
    type: toast.type,
  }))

  return <ToastContainer toasts={toastItems} onRemove={removeToast} />
}
