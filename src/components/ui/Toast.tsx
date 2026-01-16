import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

// Toast icons mapping
const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
}

// Toast colors mapping
const toastColors = {
  success: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300',
  error: 'bg-red-500/20 border-red-500/50 text-red-300',
  warning: 'bg-amber-500/20 border-amber-500/50 text-amber-300',
  info: 'bg-weather-500/20 border-weather-500/50 text-weather-300'
}

/**
 * Single Toast Component
 */
function ToastItem({ toast, onClose }: ToastProps) {
  const Icon = toastIcons[toast.type]
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id)
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [toast.id, onClose])
  
  return (
    <div 
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl',
        'animate-slide-down shadow-lg',
        toastColors[toast.type]
      )}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="p-1 hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Close toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

/**
 * Toast Container with State Management
 */
let addToastFn: ((message: string, type: ToastType) => void) | null = null

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])
  
  useEffect(() => {
    addToastFn = (message: string, type: ToastType) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      setToasts(prev => [...prev, { id, message, type }])
    }
    
    return () => {
      addToastFn = null
    }
  }, [])
  
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }
  
  if (toasts.length === 0) return null
  
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onClose={removeToast} />
        </div>
      ))}
    </div>
  )
}

/**
 * Toast utility function - call from anywhere
 */
export const toast = {
  success: (message: string) => addToastFn?.(message, 'success'),
  error: (message: string) => addToastFn?.(message, 'error'),
  warning: (message: string) => addToastFn?.(message, 'warning'),
  info: (message: string) => addToastFn?.(message, 'info')
}
