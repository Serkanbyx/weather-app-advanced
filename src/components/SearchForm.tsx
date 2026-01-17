import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Search, MapPin, Loader2 } from 'lucide-react'
import { useWeatherStore } from '@/store/weatherStore'
import { weatherApi } from '@/services/weatherApi'
import { toast } from '@/components/ui/Toast'
import { useState } from 'react'

/**
 * Zod validation schema for search form
 */
const searchSchema = z.object({
  city: z
    .string()
    .min(2, 'City name must be at least 2 characters')
    .max(100, 'City name is too long')
    .regex(/^[a-zA-ZÀ-ÿ\s\-',.]+$/, 'Please enter a valid city name')
})

type SearchFormData = z.infer<typeof searchSchema>

/**
 * Search Form Component
 * Uses React Hook Form with Zod validation
 */
export function SearchForm() {
  const { searchCity, loading, unit, clearSearch } = useWeatherStore()
  const [geoLoading, setGeoLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      city: ''
    }
  })
  
  // Handle form submission
  const onSubmit = async (data: SearchFormData) => {
    await searchCity(data.city.trim())
  }
  
  // Handle current location
  const handleCurrentLocation = async () => {
    setGeoLoading(true)
    try {
      const { weather, forecast } = await weatherApi.getCurrentLocationWeather(unit)
      
      // Try to fetch air quality for current location
      let airQuality = null
      try {
        airQuality = await weatherApi.getAirQuality(weather.coord.lat, weather.coord.lon)
      } catch {
        console.warn('Air quality data unavailable')
      }
      
      // Update store with location data
      useWeatherStore.setState({
        currentCity: weather.name,
        currentWeather: weather,
        forecast,
        airQuality,
        loading: false,
        error: null,
        lastViewed: {
          city: weather.name,
          weather,
          forecast,
          airQuality,
          timestamp: Date.now()
        }
      })
      
      reset({ city: weather.name })
      toast.success(`Weather loaded for ${weather.name}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get location'
      toast.error(message)
    } finally {
      setGeoLoading(false)
    }
  }
  
  // Handle clear
  const handleClear = () => {
    reset({ city: '' })
    clearSearch()
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="relative flex gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-storm-400" />
          </div>
          
          <input
            type="text"
            {...register('city')}
            placeholder="Search for a city..."
            className="input-field pl-12 pr-4"
            disabled={loading || geoLoading}
            autoComplete="off"
          />
          
          {/* Clear button */}
          {useWeatherStore.getState().currentCity && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-3 flex items-center text-storm-400 
                         hover:text-storm-200 transition-colors"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        
        {/* Current Location Button */}
        <button
          type="button"
          onClick={handleCurrentLocation}
          disabled={loading || geoLoading}
          className="btn-secondary px-4"
          aria-label="Use current location"
          title="Use current location"
        >
          {geoLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <MapPin className="w-5 h-5" />
          )}
        </button>
        
        {/* Search Button */}
        <button
          type="submit"
          disabled={loading || geoLoading}
          className="btn-primary px-6"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Search className="w-5 h-5 md:hidden" />
              <span className="hidden md:inline">Search</span>
            </>
          )}
        </button>
      </div>
      
      {/* Validation Error */}
      {errors.city && (
        <p className="mt-2 text-sm text-red-400 animate-slide-down">
          {errors.city.message}
        </p>
      )}
    </form>
  )
}
