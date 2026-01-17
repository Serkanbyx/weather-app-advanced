import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  CurrentWeatherResponse, 
  ForecastResponse, 
  FavoriteCity,
  UnitSystem,
  AirQualityResponse
} from '@/types/weather'
import { weatherApi } from '@/services/weatherApi'
import { generateId } from '@/lib/utils'

/**
 * Weather Store State Interface
 */
interface WeatherState {
  // Current search city
  currentCity: string
  
  // Weather data
  currentWeather: CurrentWeatherResponse | null
  forecast: ForecastResponse | null
  airQuality: AirQualityResponse | null
  
  // Favorites list
  favorites: FavoriteCity[]
  
  // UI states
  loading: boolean
  error: string | null
  
  // Settings
  unit: UnitSystem
  
  // Last viewed (for offline PWA)
  lastViewed: {
    city: string
    weather: CurrentWeatherResponse | null
    forecast: ForecastResponse | null
    airQuality: AirQualityResponse | null
    timestamp: number
  } | null
}

/**
 * Weather Store Actions Interface
 */
interface WeatherActions {
  // Search actions
  searchCity: (city: string) => Promise<void>
  clearSearch: () => void
  
  // Favorites actions
  addFavorite: (city: CurrentWeatherResponse) => void
  removeFavorite: (id: string) => void
  isFavorite: (cityName: string) => boolean
  loadFavoriteWeather: (favorite: FavoriteCity) => Promise<void>
  
  // Settings actions
  setUnit: (unit: UnitSystem) => void
  
  // Error handling
  clearError: () => void
}

type WeatherStore = WeatherState & WeatherActions

/**
 * Zustand Weather Store with Persistence
 */
export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentCity: '',
      currentWeather: null,
      forecast: null,
      airQuality: null,
      favorites: [],
      loading: false,
      error: null,
      unit: 'metric',
      lastViewed: null,

      // Search for a city
      searchCity: async (city: string) => {
        if (!city.trim()) {
          set({ error: 'Please enter a city name' })
          return
        }

        set({ loading: true, error: null, currentCity: city })

        try {
          // Fetch current weather and forecast in parallel
          const [weather, forecast] = await Promise.all([
            weatherApi.getCurrentWeather(city, get().unit),
            weatherApi.getForecast(city, get().unit)
          ])

          // Fetch air quality using coordinates from weather response
          let airQuality: AirQualityResponse | null = null
          try {
            airQuality = await weatherApi.getAirQuality(weather.coord.lat, weather.coord.lon)
          } catch {
            // Air quality fetch failed, continue without it
            console.warn('Air quality data unavailable')
          }

          set({ 
            currentWeather: weather, 
            forecast,
            airQuality,
            loading: false,
            lastViewed: {
              city,
              weather,
              forecast,
              airQuality,
              timestamp: Date.now()
            }
          })
        } catch (error) {
          const message = error instanceof Error 
            ? error.message 
            : 'Failed to fetch weather data'
          
          set({ 
            loading: false, 
            error: message,
            currentWeather: null,
            forecast: null,
            airQuality: null
          })
        }
      },

      // Clear search results
      clearSearch: () => {
        set({
          currentCity: '',
          currentWeather: null,
          forecast: null,
          airQuality: null,
          error: null
        })
      },

      // Add city to favorites
      addFavorite: (city: CurrentWeatherResponse) => {
        const { favorites } = get()
        
        // Check if already exists
        if (favorites.some(f => f.name.toLowerCase() === city.name.toLowerCase())) {
          return
        }

        const newFavorite: FavoriteCity = {
          id: generateId(),
          name: city.name,
          country: city.sys.country,
          coord: city.coord,
          addedAt: Date.now()
        }

        set({ favorites: [...favorites, newFavorite] })
      },

      // Remove city from favorites
      removeFavorite: (id: string) => {
        const { favorites } = get()
        set({ favorites: favorites.filter(f => f.id !== id) })
      },

      // Check if city is in favorites
      isFavorite: (cityName: string) => {
        const { favorites } = get()
        return favorites.some(f => f.name.toLowerCase() === cityName.toLowerCase())
      },

      // Load weather for a favorite city
      loadFavoriteWeather: async (favorite: FavoriteCity) => {
        set({ loading: true, error: null, currentCity: favorite.name })

        try {
          const [weather, forecast] = await Promise.all([
            weatherApi.getCurrentWeatherByCoords(favorite.coord.lat, favorite.coord.lon, get().unit),
            weatherApi.getForecastByCoords(favorite.coord.lat, favorite.coord.lon, get().unit)
          ])

          // Fetch air quality
          let airQuality: AirQualityResponse | null = null
          try {
            airQuality = await weatherApi.getAirQuality(favorite.coord.lat, favorite.coord.lon)
          } catch {
            console.warn('Air quality data unavailable')
          }

          set({ 
            currentWeather: weather, 
            forecast,
            airQuality,
            loading: false,
            lastViewed: {
              city: favorite.name,
              weather,
              forecast,
              airQuality,
              timestamp: Date.now()
            }
          })
        } catch (error) {
          const message = error instanceof Error 
            ? error.message 
            : 'Failed to fetch weather data'
          
          set({ loading: false, error: message })
        }
      },

      // Set temperature unit
      setUnit: (unit: UnitSystem) => {
        const { currentCity } = get()
        set({ unit })
        
        // Refetch if there's a current search
        if (currentCity) {
          get().searchCity(currentCity)
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null })
      }
    }),
    {
      name: 'weather-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        unit: state.unit,
        lastViewed: state.lastViewed
      })
    }
  )
)
