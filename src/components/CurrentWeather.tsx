import { Heart, Droplets, Wind, Eye, Thermometer, Sunrise, Sunset } from 'lucide-react'
import { useWeatherStore } from '@/store/weatherStore'
import { 
  formatTemp, 
  formatWindSpeed, 
  formatTime, 
  getWeatherIconUrl,
  getWindDirection,
  isNightTime,
  getWeatherGradient,
  cn
} from '@/lib/utils'
import { toast } from '@/components/ui/Toast'

/**
 * Current Weather Card Component
 * Displays current weather conditions for a city
 */
export function CurrentWeather() {
  const { currentWeather, unit, addFavorite, removeFavorite, isFavorite, favorites } = useWeatherStore()
  
  if (!currentWeather) return null
  
  const { main, weather, wind, sys, name, visibility, dt, timezone } = currentWeather
  const weatherInfo = weather[0]
  const isNight = isNightTime(sys.sunrise, sys.sunset, dt)
  const isFav = isFavorite(name)
  const favItem = favorites.find(f => f.name.toLowerCase() === name.toLowerCase())
  
  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    if (isFav && favItem) {
      removeFavorite(favItem.id)
      toast.info(`${name} removed from favorites`)
    } else {
      addFavorite(currentWeather)
      toast.success(`${name} added to favorites`)
    }
  }
  
  // Weather stats data
  const stats = [
    { 
      icon: Thermometer, 
      label: 'Feels like', 
      value: formatTemp(main.feels_like, unit) 
    },
    { 
      icon: Droplets, 
      label: 'Humidity', 
      value: `${main.humidity}%` 
    },
    { 
      icon: Wind, 
      label: 'Wind', 
      value: `${formatWindSpeed(wind.speed, unit)} ${getWindDirection(wind.deg)}` 
    },
    { 
      icon: Eye, 
      label: 'Visibility', 
      value: `${(visibility / 1000).toFixed(1)} km` 
    },
    { 
      icon: Sunrise, 
      label: 'Sunrise', 
      value: formatTime(sys.sunrise, timezone) 
    },
    { 
      icon: Sunset, 
      label: 'Sunset', 
      value: formatTime(sys.sunset, timezone) 
    }
  ]
  
  return (
    <div className="glass-card overflow-hidden animate-slide-up">
      {/* Gradient header based on weather */}
      <div 
        className={cn(
          'absolute inset-0 opacity-20 bg-gradient-to-br',
          getWeatherGradient(weatherInfo.id, isNight)
        )}
      />
      
      <div className="relative">
        {/* Header with city name and favorite */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-display font-bold text-storm-50">
              {name}
            </h2>
            <p className="text-storm-400 font-medium">
              {sys.country} • {isNight ? 'Night' : 'Day'}
            </p>
          </div>
          
          <button
            onClick={handleFavoriteToggle}
            className={cn(
              'p-3 rounded-xl transition-all duration-200',
              isFav 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-storm-700/50 text-storm-400 hover:text-red-400 hover:bg-storm-700'
            )}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={cn('w-5 h-5', isFav && 'fill-current')} />
          </button>
        </div>
        
        {/* Main weather display */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <img 
              src={getWeatherIconUrl(weatherInfo.icon, '4x')} 
              alt={weatherInfo.description}
              className="w-28 h-28 weather-icon animate-float"
            />
          </div>
          
          <div>
            <p className="text-6xl font-display font-bold gradient-text">
              {formatTemp(main.temp, unit)}
            </p>
            <p className="text-lg text-storm-300 capitalize font-medium">
              {weatherInfo.description}
            </p>
            <p className="text-sm text-storm-400">
              H: {formatTemp(main.temp_max, unit)} • L: {formatTemp(main.temp_min, unit)}
            </p>
          </div>
        </div>
        
        {/* Weather stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className={cn(
                'bg-storm-700/30 rounded-xl p-4 transition-all duration-200 hover:bg-storm-700/50',
                'animate-fade-in'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-2 text-storm-400 mb-1">
                <stat.icon className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">
                  {stat.label}
                </span>
              </div>
              <p className="text-lg font-semibold text-storm-100">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
