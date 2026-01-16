import { CloudSun, TrendingUp } from 'lucide-react'
import { SearchForm } from '@/components/SearchForm'
import { CurrentWeather } from '@/components/CurrentWeather'
import { Forecast, HourlyForecastPreview } from '@/components/Forecast'
import { WeatherCardSkeleton, ForecastCardSkeleton } from '@/components/ui/Skeleton'
import { ErrorAlert, EmptyState } from '@/components/ui/Alert'
import { useWeatherStore } from '@/store/weatherStore'

/**
 * Home Page Component
 * Main weather search and display page
 */
export function HomePage() {
  const { 
    currentWeather, 
    forecast, 
    loading, 
    error, 
    clearError, 
    currentCity,
    searchCity,
    lastViewed 
  } = useWeatherStore()
  
  // Render loading state
  const renderLoading = () => (
    <div className="grid lg:grid-cols-2 gap-6 mt-8">
      <div className="space-y-6">
        <WeatherCardSkeleton />
      </div>
      <div className="space-y-6">
        <ForecastCardSkeleton />
      </div>
    </div>
  )
  
  // Render error state
  const renderError = () => (
    <div className="mt-8 max-w-lg mx-auto">
      <ErrorAlert 
        message={error!} 
        onDismiss={clearError}
        onRetry={() => currentCity && searchCity(currentCity)}
      />
    </div>
  )
  
  // Render empty state
  const renderEmpty = () => (
    <EmptyState
      icon={<CloudSun className="w-12 h-12 text-weather-400" />}
      title="Search for a city"
      description="Enter a city name to get current weather conditions and a 5-day forecast. You can also use your current location."
      action={
        lastViewed && (
          <button
            onClick={() => searchCity(lastViewed.city)}
            className="btn-secondary"
          >
            <TrendingUp className="w-4 h-4" />
            Load last viewed: {lastViewed.city}
          </button>
        )
      }
    />
  )
  
  // Render weather data
  const renderWeather = () => (
    <div className="grid lg:grid-cols-2 gap-6 mt-8">
      <div className="space-y-6">
        <CurrentWeather />
      </div>
      <div className="space-y-6">
        <HourlyForecastPreview />
        <Forecast />
      </div>
    </div>
  )
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-3">
          Weather Forecast
        </h1>
        <p className="text-storm-400 max-w-md mx-auto">
          Get accurate weather information for any city worldwide
        </p>
      </div>
      
      {/* Search Form */}
      <div className="max-w-2xl mx-auto">
        <SearchForm />
      </div>
      
      {/* Content */}
      {loading && renderLoading()}
      {error && !loading && renderError()}
      {!loading && !error && currentWeather && forecast && renderWeather()}
      {!loading && !error && !currentWeather && renderEmpty()}
    </div>
  )
}
