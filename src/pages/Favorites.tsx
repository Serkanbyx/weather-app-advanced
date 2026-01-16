import { Heart, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FavoriteCard } from '@/components/FavoriteCard'
import { EmptyState } from '@/components/ui/Alert'
import { useWeatherStore } from '@/store/weatherStore'

/**
 * Favorites Page Component
 * Displays saved favorite cities
 */
export function FavoritesPage() {
  const { favorites } = useWeatherStore()
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-text mb-2">
            Favorite Cities
          </h1>
          <p className="text-storm-400">
            Quick access to your saved locations
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-storm-400">
          <Heart className="w-5 h-5" />
          <span className="font-semibold">{favorites.length} saved</span>
        </div>
      </div>
      
      {/* Favorites List */}
      {favorites.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {favorites.map((favorite, index) => (
            <FavoriteCard key={favorite.id} favorite={favorite} index={index} />
          ))}
        </div>
      ) : (
        <div className="glass-card">
          <EmptyState
            icon={<Heart className="w-12 h-12 text-storm-500" />}
            title="No favorites yet"
            description="Search for a city and click the heart icon to add it to your favorites for quick access."
            action={
              <Link to="/" className="btn-primary">
                <Plus className="w-4 h-4" />
                Add your first city
              </Link>
            }
          />
        </div>
      )}
      
      {/* Tips Section */}
      {favorites.length > 0 && (
        <div className="mt-8 p-6 bg-storm-800/30 rounded-2xl border border-storm-700/50">
          <h3 className="font-semibold text-storm-200 mb-2">💡 Tips</h3>
          <ul className="space-y-2 text-sm text-storm-400">
            <li>• Click on a city card to view its current weather</li>
            <li>• Favorites are saved locally and work offline</li>
            <li>• You can remove a city by hovering and clicking the trash icon</li>
          </ul>
        </div>
      )}
    </div>
  )
}
