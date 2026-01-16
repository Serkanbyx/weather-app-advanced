import { Trash2, MapPin } from 'lucide-react'
import type { FavoriteCity } from '@/types/weather'
import { useWeatherStore } from '@/store/weatherStore'
import { toast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

interface FavoriteCardProps {
  favorite: FavoriteCity
  index: number
}

/**
 * Favorite City Card Component
 * Displays a saved favorite city with quick actions
 */
export function FavoriteCard({ favorite, index }: FavoriteCardProps) {
  const { removeFavorite, loadFavoriteWeather } = useWeatherStore()
  const navigate = useNavigate()
  
  // Handle card click - load weather and navigate
  const handleClick = async () => {
    await loadFavoriteWeather(favorite)
    navigate('/')
    toast.success(`Weather loaded for ${favorite.name}`)
  }
  
  // Handle remove
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    removeFavorite(favorite.id)
    toast.info(`${favorite.name} removed from favorites`)
  }
  
  return (
    <div 
      onClick={handleClick}
      className={cn(
        'glass-card cursor-pointer group transition-all duration-300',
        'hover:border-weather-500/50 hover:shadow-glow',
        'animate-slide-up'
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-weather-500/20 rounded-xl group-hover:bg-weather-500/30 transition-colors">
            <MapPin className="w-6 h-6 text-weather-400" />
          </div>
          
          <div>
            <h3 className="font-semibold text-storm-100 group-hover:text-weather-300 transition-colors">
              {favorite.name}
            </h3>
            <p className="text-sm text-storm-400">
              {favorite.country}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Weather */}
          <span className="text-sm text-storm-400 group-hover:text-weather-400 transition-colors">
            View →
          </span>
          
          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="p-2 rounded-lg opacity-0 group-hover:opacity-100 
                       hover:bg-red-500/20 text-storm-400 hover:text-red-400
                       transition-all duration-200"
            aria-label="Remove from favorites"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Favorites List Component
 */
export function FavoritesList() {
  const { favorites } = useWeatherStore()
  
  if (favorites.length === 0) {
    return null
  }
  
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-display font-bold text-storm-200 mb-4">
        Favorite Cities ({favorites.length})
      </h3>
      
      {favorites.map((favorite, index) => (
        <FavoriteCard key={favorite.id} favorite={favorite} index={index} />
      ))}
    </div>
  )
}
