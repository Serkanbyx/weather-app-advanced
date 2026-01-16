import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, MapPin } from 'lucide-react'
import { CurrentWeather } from '@/components/CurrentWeather'
import { Forecast, HourlyForecastPreview } from '@/components/Forecast'
import { WeatherCardSkeleton, ForecastCardSkeleton } from '@/components/ui/Skeleton'
import { ErrorAlert } from '@/components/ui/Alert'
import { useWeatherStore } from '@/store/weatherStore'

/**
 * City Detail Page Component
 * Shows detailed weather for a specific city
 */
export function CityDetailPage() {
  const { name } = useParams<{ name: string }>()
  const navigate = useNavigate()
  const { 
    currentWeather, 
    forecast, 
    loading, 
    error, 
    searchCity, 
    clearError,
    currentCity 
  } = useWeatherStore()
  
  // Load city weather on mount
  useEffect(() => {
    if (name && name !== currentCity) {
      searchCity(decodeURIComponent(name))
    }
  }, [name, currentCity, searchCity])
  
  // Handle retry
  const handleRetry = () => {
    if (name) {
      searchCity(decodeURIComponent(name))
    }
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Navigation */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="btn-ghost"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>
      
      {/* City Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-weather-500/20 rounded-xl">
          <MapPin className="w-8 h-8 text-weather-400" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold gradient-text">
            {name ? decodeURIComponent(name) : 'City Weather'}
          </h1>
          <p className="text-storm-400">Detailed weather information</p>
        </div>
      </div>
      
      {/* Content */}
      {loading && (
        <div className="grid lg:grid-cols-2 gap-6">
          <WeatherCardSkeleton />
          <div className="space-y-6">
            <ForecastCardSkeleton />
          </div>
        </div>
      )}
      
      {error && !loading && (
        <div className="max-w-lg mx-auto">
          <ErrorAlert 
            message={error} 
            onDismiss={clearError}
            onRetry={handleRetry}
          />
          <div className="text-center mt-6">
            <Link to="/" className="btn-secondary">
              <ArrowLeft className="w-4 h-4" />
              Back to Search
            </Link>
          </div>
        </div>
      )}
      
      {!loading && !error && currentWeather && forecast && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <CurrentWeather />
          </div>
          <div className="space-y-6">
            <HourlyForecastPreview />
            <Forecast />
          </div>
        </div>
      )}
    </div>
  )
}
