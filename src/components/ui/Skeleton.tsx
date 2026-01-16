import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

/**
 * Skeleton loading component
 * Used for loading states with pulse animation
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('skeleton', className)} />
  )
}

/**
 * Weather Card Skeleton
 */
export function WeatherCardSkeleton() {
  return (
    <div className="glass-card animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      
      <div className="flex items-center gap-6 mb-6">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div>
          <Skeleton className="h-16 w-32 mb-2" />
          <Skeleton className="h-5 w-40" />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-storm-700/30 rounded-xl p-4">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Forecast Card Skeleton
 */
export function ForecastCardSkeleton() {
  return (
    <div className="glass-card animate-fade-in">
      <Skeleton className="h-7 w-40 mb-6" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-storm-700/30 rounded-xl">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Favorite Card Skeleton
 */
export function FavoriteCardSkeleton() {
  return (
    <div className="glass-card animate-fade-in p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div>
            <Skeleton className="h-5 w-24 mb-1" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  )
}
