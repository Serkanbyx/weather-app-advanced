import { AlertCircle, X, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AlertProps {
  message: string
  onDismiss?: () => void
  onRetry?: () => void
  className?: string
}

/**
 * Error Alert Component
 * Displays error messages with dismiss and retry options
 */
export function ErrorAlert({ message, onDismiss, onRetry, className }: AlertProps) {
  return (
    <div 
      className={cn(
        'flex items-start gap-4 p-4 rounded-2xl',
        'bg-red-500/10 border border-red-500/30',
        'animate-scale-in',
        className
      )}
    >
      <div className="p-2 bg-red-500/20 rounded-xl">
        <AlertCircle className="w-5 h-5 text-red-400" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-red-300 mb-1">
          Something went wrong
        </h4>
        <p className="text-sm text-red-300/80">
          {message}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium 
                       text-red-300 hover:text-red-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
        )}
      </div>
      
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-2 hover:bg-red-500/20 rounded-xl transition-colors"
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4 text-red-400" />
        </button>
      )}
    </div>
  )
}

/**
 * Info Alert Component
 */
export function InfoAlert({ message, onDismiss, className }: Omit<AlertProps, 'onRetry'>) {
  return (
    <div 
      className={cn(
        'flex items-start gap-4 p-4 rounded-2xl',
        'bg-weather-500/10 border border-weather-500/30',
        'animate-scale-in',
        className
      )}
    >
      <div className="p-2 bg-weather-500/20 rounded-xl">
        <AlertCircle className="w-5 h-5 text-weather-400" />
      </div>
      
      <p className="flex-1 text-sm text-weather-300">
        {message}
      </p>
      
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-2 hover:bg-weather-500/20 rounded-xl transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4 text-weather-400" />
        </button>
      )}
    </div>
  )
}

/**
 * Empty State Component
 */
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      {icon && (
        <div className="mb-4 p-4 bg-storm-700/50 rounded-2xl">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-storm-200 mb-2">
        {title}
      </h3>
      <p className="text-storm-400 max-w-sm mb-6">
        {description}
      </p>
      {action}
    </div>
  )
}
